'use client';

import { useState } from 'react';
import { X, Calendar, Shield, Laptop, FileText, Check, HelpCircle, ChevronDown, Info } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Meeting } from '@/lib/types';

interface ScheduleModalProps {
  onClose: () => void;
  onScheduled: (meeting: Meeting) => void;
}

export default function ScheduleModal({ onClose, onScheduled }: ScheduleModalProps) {
  // Section 1: Details
  const [topic, setTopic] = useState('My Meeting');
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState('');
  
  // Format today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [timeHour, setTimeHour] = useState('5:00');
  const [timeAmPm, setTimeAmPm] = useState('AM');
  const [durationHr, setDurationHr] = useState('0');
  const [durationMin, setDurationMin] = useState('40');
  const [timeZone, setTimeZone] = useState('(GMT-7:00) Pacific Time (US and Canada)');
  const [recurring, setRecurring] = useState(false);
  const [invitees, setInvitees] = useState('');

  // Section 2: Security & ID
  const [meetingIdType, setMeetingIdType] = useState<'auto' | 'pmi'>('auto');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [passcodeChecked, setPasscodeChecked] = useState(true);
  const [passcode, setPasscode] = useState('V4rzUy');
  const [waitingRoomChecked, setWaitingRoomChecked] = useState(false);
  const [encryption, setEncryption] = useState<'enhanced' | 'e2e'>('enhanced');

  // Section 3: Summary, AI & Video
  const [aiCompanionChecked, setAiCompanionChecked] = useState(false);
  const [autoSummaryChecked, setAutoSummaryChecked] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState('General template');
  const [showSummaryPopover, setShowSummaryPopover] = useState(true);
  const [myNotesChecked, setMyNotesChecked] = useState(true);
  const [meetingChatChecked, setMeetingChatChecked] = useState(true);
  const [videoHost, setVideoHost] = useState<'on' | 'off'>('on');
  const [videoParticipant, setVideoParticipant] = useState<'on' | 'off'>('on');
  const [interpretationChecked, setInterpretationChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date) {
      toast.error('Please enter a topic and date');
      return;
    }

    // Convert timeHour e.g. "5:00" + "AM/PM" to HH:MM format
    const [hourStr, minStr] = timeHour.split(':');
    let hour = parseInt(hourStr);
    const min = parseInt(minStr);
    if (timeAmPm === 'PM' && hour !== 12) hour += 12;
    if (timeAmPm === 'AM' && hour === 12) hour = 0;
    
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMin = String(min).padStart(2, '0');
    const start_time = new Date(`${date}T${formattedHour}:${formattedMin}:00`).toISOString();

    // Total duration in minutes
    const duration = parseInt(durationHr) * 60 + parseInt(durationMin);

    setLoading(true);
    try {
      const res = await api.post('/api/meetings/schedule', {
        title: topic,
        description: description || undefined,
        start_time,
        duration,
      });
      toast.success('Meeting scheduled successfully! 🗓️');
      onScheduled(res.data);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 select-none overflow-y-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-[#FAFAFC] rounded-2xl border border-gray-200 shadow-2xl w-full max-w-[850px] max-h-[90vh] overflow-hidden flex flex-col p-0 animate-scale-in text-left">
        
        {/* Sticky Header */}
        <div className="bg-[#FAFAFC] px-8 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
          <div>
            <span
              onClick={onClose}
              className="text-[13px] font-medium text-[#0E71EB] hover:underline mb-1 cursor-pointer block"
            >
              &lt; Back to Meetings
            </span>
            <h2 className="text-[22px] font-bold text-[#1A1A1A]">Schedule Meeting</h2>
          </div>
          <button
            id="schedule-modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-white">
          
          {/* SECTION 1: DETAILS */}
          <div className="space-y-5">
            {/* Topic Field */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Topic <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  id="schedule-title"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full max-w-md h-10 px-3 border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                />
                
                {/* Expandable Description Link */}
                {!showDescription ? (
                  <button
                    type="button"
                    onClick={() => setShowDescription(true)}
                    className="text-[13px] text-[#0E71EB] hover:underline mt-2 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    + Add Description
                  </button>
                ) : (
                  <div className="mt-3">
                    <textarea
                      id="schedule-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description here..."
                      rows={2}
                      className="w-full max-w-md p-3 border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB] resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* When Field */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                When
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Date Picker */}
                <div className="relative flex items-center">
                  <input
                    id="schedule-date"
                    type="date"
                    value={date}
                    min={todayStr}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 px-3 pr-8 border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                  />
                </div>

                {/* Time Picker */}
                <select
                  value={timeHour}
                  onChange={(e) => setTimeHour(e.target.value)}
                  className="h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                >
                  {['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>

                {/* AM/PM */}
                <select
                  value={timeAmPm}
                  onChange={(e) => setTimeAmPm(e.target.value)}
                  className="h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Duration Field */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Duration
              </label>
              <div>
                <div className="flex items-center gap-3">
                  {/* Hours */}
                  <div className="flex items-center gap-1.5">
                    <select
                      id="schedule-duration-hr"
                      value={durationHr}
                      onChange={(e) => setDurationHr(e.target.value)}
                      className="h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                    >
                      {['0', '1', '2', '3', '4'].map((hr) => (
                        <option key={hr} value={hr}>{hr}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">hr</span>
                  </div>

                  {/* Minutes */}
                  <div className="flex items-center gap-1.5">
                    <select
                      id="schedule-duration-min"
                      value={durationMin}
                      onChange={(e) => setDurationMin(e.target.value)}
                      className="h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                    >
                      {['15', '30', '40', '45'].map((min) => (
                        <option key={min} value={min}>{min}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">min</span>
                  </div>
                </div>

                {/* Yellow Warning Banner */}
                <div className="max-w-xl mt-4 bg-[#FFFBEB] border border-amber-200/60 rounded-lg p-3 text-[13px] text-amber-800 flex items-start gap-2 shadow-sm select-none">
                  <span className="text-base select-none mt-0.5 leading-none">⚠️</span>
                  <div>
                    <span>You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time? </span>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert('Plans and billing portal integration coming soon!'); }}
                      className="text-[#0E71EB] hover:underline font-semibold"
                    >
                      Upgrade to Zoom Workplace Pro
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Zone Field */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Time Zone
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full max-w-md h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
              >
                <option value="(GMT-7:00) Pacific Time (US and Canada)">(GMT-7:00) Pacific Time (US and Canada)</option>
                <option value="(GMT+5:30) India Standard Time">(GMT+5:30) India Standard Time</option>
                <option value="(GMT+0:00) Greenwich Mean Time">(GMT+0:00) Greenwich Mean Time</option>
              </select>
            </div>

            {/* Recurring Meeting Checkbox */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <div />
              <div className="flex items-center gap-2">
                <input
                  id="schedule-recurring"
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                />
                <label htmlFor="schedule-recurring" className="text-sm text-gray-700 select-none cursor-pointer">
                  Recurring meeting
                </label>
              </div>
            </div>

            {/* Invitees Field */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Invitees
              </label>
              <input
                id="schedule-invitees"
                type="text"
                value={invitees}
                onChange={(e) => setInvitees(e.target.value)}
                placeholder="Enter user names or email addresses"
                className="w-full max-w-md h-10 px-3 border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 2: SECURITY & ID (Screen 4) */}
          <div className="space-y-6">
            {/* Meeting ID */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-1.5 text-left">
                Meeting ID
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="meetingIdType"
                    checked={meetingIdType === 'auto'}
                    onChange={() => setMeetingIdType('auto')}
                    className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                  />
                  Generate Automatically
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="meetingIdType"
                    checked={meetingIdType === 'pmi'}
                    onChange={() => setMeetingIdType('pmi')}
                    className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                  />
                  Personal Meeting ID 641 590 7047
                </label>
              </div>
            </div>

            {/* Template */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full max-w-md h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
              >
                <option value="">Select a template</option>
                <option value="standup">Daily Scrum/Standup Template</option>
                <option value="webinar">Large Webinar Template</option>
              </select>
            </div>

            {/* Whiteboard Options */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left flex items-center gap-1">
                Whiteboard
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </label>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 h-9 px-4 border border-[#CBD5E1] bg-white text-gray-700 rounded-md text-[13px] hover:bg-gray-50 transition-colors font-medium max-w-[170px]"
              >
                <Laptop className="w-4 h-4" />
                Add Whiteboard
              </button>
            </div>

            {/* Docs Options */}
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                Docs
              </label>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 h-9 px-4 border border-[#CBD5E1] bg-white text-gray-700 rounded-md text-[13px] hover:bg-gray-50 transition-colors font-medium max-w-[140px]"
              >
                <FileText className="w-4 h-4" />
                Add Docs
              </button>
            </div>

            {/* Security Options */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-1.5 text-left">
                Security
              </label>
              <div className="space-y-4">
                {/* Passcode Checkbox */}
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      id="security-passcode-check"
                      type="checkbox"
                      checked={passcodeChecked}
                      onChange={(e) => setPasscodeChecked(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                    />
                    <label htmlFor="security-passcode-check" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                      Passcode
                    </label>
                    <input
                      type="text"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      disabled={!passcodeChecked}
                      className="w-28 h-8 px-2 border border-[#CBD5E1] rounded-[4px] text-xs font-semibold text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 select-none">
                    Only users who have the invite link or passcode can join the meeting
                  </p>
                </div>

                {/* Waiting Room Checkbox */}
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      id="security-waiting-room"
                      type="checkbox"
                      checked={waitingRoomChecked}
                      onChange={(e) => setWaitingRoomChecked(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                    />
                    <label htmlFor="security-waiting-room" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
                      Waiting Room
                    </label>
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 select-none">
                    Only users admitted by the host can join the meeting
                  </p>
                </div>
              </div>
            </div>

            {/* Encryption options */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-1 text-left">
                Encryption
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption === 'enhanced'}
                    onChange={() => setEncryption('enhanced')}
                    className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                  />
                  <Shield className="w-4 h-4 text-green-600 fill-green-600/10" />
                  Enhanced encryption
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                </label>

                <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="encryption"
                    checked={encryption === 'e2e'}
                    onChange={() => setEncryption('e2e')}
                    className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                  />
                  <Shield className="w-4 h-4 text-green-700 fill-green-700/30" />
                  End-to-end encryption
                  <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                </label>
              </div>
            </div>

            {/* AI Companion options */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-1 text-left">
                AI Companion
              </label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    id="ai-companion-opt"
                    type="checkbox"
                    checked={aiCompanionChecked}
                    onChange={(e) => setAiCompanionChecked(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                  />
                  <label htmlFor="ai-companion-opt" className="text-sm font-semibold text-gray-800 cursor-pointer select-none">
                    AI Companion
                  </label>
                </div>
                <div className="flex items-center gap-1.5 select-none pl-6 text-[12px] text-gray-500">
                  <input
                    id="ai-companion-sub"
                    type="checkbox"
                    checked={aiCompanionChecked}
                    disabled={!aiCompanionChecked}
                    className="w-3.5 h-3.5 rounded border-gray-300"
                  />
                  <label htmlFor="ai-companion-sub">Automatically start AI Companion</label>
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 3: SUMMARY & VIDEO (Screen 2) */}
          <div className="space-y-6">
            {/* Automatically start summary */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <div />
              <div className="flex items-center gap-2">
                <input
                  id="auto-meeting-summary"
                  type="checkbox"
                  checked={autoSummaryChecked}
                  onChange={(e) => setAutoSummaryChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                />
                <label htmlFor="auto-meeting-summary" className="text-sm text-gray-700 select-none cursor-pointer">
                  Automatically start meeting summary
                </label>
              </div>
            </div>

            {/* Summary Template */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4 relative">
              <label className="text-[13px] font-semibold text-gray-700 pt-2 text-left">
                Meeting summary template
              </label>
              <div>
                <div className="flex items-center gap-3">
                  <select
                    value={summaryTemplate}
                    onChange={(e) => setSummaryTemplate(e.target.value)}
                    className="w-full max-w-[280px] h-10 px-3 bg-white border border-[#CBD5E1] rounded-[6px] text-sm text-[#1A1A1A] focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB]"
                  >
                    <option value="General template">General template</option>
                    <option value="Custom template">Custom template</option>
                  </select>
                </div>

                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[13px] text-[#0E71EB] hover:underline mt-2 font-medium block text-left"
                >
                  Change default summary template &gt;
                </a>

                {/* Popover Card Mockup */}
                {showSummaryPopover && (
                  <div className="absolute top-[-24px] left-[320px] w-[280px] bg-white border border-gray-200/80 rounded-xl shadow-xl p-4 animate-scale-in select-none">
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-50 mb-2">
                      <span className="bg-[#E0F2FE] text-[#0369A1] text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider uppercase">
                        NEW
                      </span>
                      <h4 className="text-[13px] font-bold text-gray-900 flex-1 ml-2">
                        Meeting summary template
                      </h4>
                      <X
                        className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        onClick={() => setShowSummaryPopover(false)}
                      />
                    </div>
                    <p className="text-[12px] text-gray-600 leading-normal">
                      You can now select a summary template based on different meeting types.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                Workflow
              </label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Workflows integration is coming soon!'); }}
                className="text-[13px] text-[#0E71EB] hover:underline font-medium text-left cursor-pointer"
              >
                Attach workflow to this meeting
              </a>
            </div>

            {/* My Notes */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                My notes
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="allow-transcript-notes"
                  type="checkbox"
                  checked={myNotesChecked}
                  onChange={(e) => setMyNotesChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                />
                <label htmlFor="allow-transcript-notes" className="text-sm text-gray-700 select-none cursor-pointer">
                  Allow everyone to use meeting transcript with My notes
                </label>
              </div>
            </div>

            {/* Meeting Chat */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                Meeting chat
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="enable-continuous-chat"
                  type="checkbox"
                  checked={meetingChatChecked}
                  onChange={(e) => setMeetingChatChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
                />
                <label htmlFor="enable-continuous-chat" className="text-sm text-gray-700 select-none cursor-pointer flex items-center gap-1">
                  Enable Continuous Meeting Chat
                  <Info className="w-3.5 h-3.5 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Video toggles */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 pt-0.5 text-left">
                Video
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span className="w-20 font-medium text-gray-600">Host</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="videoHost"
                      checked={videoHost === 'on'}
                      onChange={() => setVideoHost('on')}
                      className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                    />
                    on
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="videoHost"
                      checked={videoHost === 'off'}
                      onChange={() => setVideoHost('off')}
                      className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                    />
                    off
                  </label>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-700">
                  <span className="w-20 font-medium text-gray-600">Participant</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="videoParticipant"
                      checked={videoParticipant === 'on'}
                      onChange={() => setVideoParticipant('on')}
                      className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                    />
                    on
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="videoParticipant"
                      checked={videoParticipant === 'off'}
                      onChange={() => setVideoParticipant('off')}
                      className="w-4 h-4 border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB]"
                    />
                    off
                  </label>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                Options
              </label>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Advanced Zoom Options panel.'); }}
                className="text-[13px] text-[#0E71EB] hover:underline font-medium text-left cursor-pointer"
              >
                Show
              </a>
            </div>

            {/* Interpretation */}
            <div className="grid grid-cols-[160px_1fr] items-start gap-4">
              <label className="text-[13px] font-semibold text-gray-700 text-left">
                Interpretation
              </label>
              <div className="flex items-start gap-2">
                <input
                  id="sign-lang-interpretation"
                  type="checkbox"
                  checked={interpretationChecked}
                  onChange={(e) => setInterpretationChecked(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer mt-1"
                />
                <label htmlFor="sign-lang-interpretation" className="text-sm text-gray-700 select-none cursor-pointer max-w-lg leading-normal">
                  Select sign language interpretation video channels below. You can assign interpreters at any time.
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Footer for Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center gap-3 justify-start bg-white sticky bottom-0 z-10">
            <button
              id="schedule-submit"
              type="submit"
              disabled={loading}
              className="h-10 px-5 bg-[#0E71EB] hover:bg-[#005BCC] text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-md shadow-blue-500/10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>

            <button
              id="schedule-cancel"
              type="button"
              onClick={onClose}
              className="h-10 px-5 border border-[#CBD5E1] text-[#1A1A1A] bg-white rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
