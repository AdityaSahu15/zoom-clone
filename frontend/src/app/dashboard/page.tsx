'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays, X, Check, Trash2, Copy, ExternalLink,
  HelpCircle, Info, Shield, Laptop, FileText, Calendar, Plus, ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import JoinModal from '@/components/JoinModal';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Meeting } from '@/lib/types';
import { toast } from 'sonner';
import { format, isPast } from 'date-fns';

export default function PortalDashboard() {
  const { user, loading: authLoading, isLoggingOut } = useAuth();
  const router = useRouter();

  // Navigation: 'home' | 'meetings' | 'schedule'
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMeetingTab, setActiveMeetingTab] = useState<'upcoming' | 'previous'>('upcoming');

  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingsLoading, setMeetingsLoading] = useState(true);

  // Modal displays
  const [showJoin, setShowJoin] = useState(false);
  const [copyingLink, setCopyingLink] = useState(false);
  const [copyingPMI, setCopyingPMI] = useState(false);

  // --- Schedule Form Fields (Blended View) ---
  const [topic, setTopic] = useState('My Meeting');
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState('');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [timeHour, setTimeHour] = useState('5:00');
  const [timeAmPm, setTimeAmPm] = useState('PM');
  const [durationHr, setDurationHr] = useState('0');
  const [durationMin, setDurationMin] = useState('40');
  const [timeZone, setTimeZone] = useState('(GMT-7:00) Pacific Time (US and Canada)');
  const [recurring, setRecurring] = useState(false);
  const [invitees, setInvitees] = useState('');

  const [meetingIdType, setMeetingIdType] = useState<'auto' | 'pmi'>('auto');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [passcodeChecked, setPasscodeChecked] = useState(true);
  const [passcode, setPasscode] = useState('w42Kn2');
  const [waitingRoomChecked, setWaitingRoomChecked] = useState(false);
  const [encryption, setEncryption] = useState<'enhanced' | 'e2e'>('enhanced');

  const [aiCompanionChecked, setAiCompanionChecked] = useState(false);
  const [autoSummaryQuestionsChecked, setAutoSummaryQuestionsChecked] = useState(false);
  const [autoSummaryTextChecked, setAutoSummaryTextChecked] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState('General template');
  const [showSummaryPopover, setShowSummaryPopover] = useState(true);
  const [myNotesChecked, setMyNotesChecked] = useState(true);
  const [meetingChatChecked, setMeetingChatChecked] = useState(true);
  const [videoHost, setVideoHost] = useState<'on' | 'off'>('on');
  const [videoParticipant, setVideoParticipant] = useState<'on' | 'off'>('on');
  const [interpretationChecked, setInterpretationChecked] = useState(false);

  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user && !isLoggingOut) {
      router.push('/login');
    }
  }, [user, authLoading, router, isLoggingOut]);

  const fetchMeetings = useCallback(async () => {
    setMeetingsLoading(true);
    try {
      const [upcomingRes, recentRes] = await Promise.all([
        api.get('/api/meetings/upcoming'),
        api.get('/api/meetings/recent'),
      ]);
      setUpcomingMeetings(upcomingRes.data);
      setRecentMeetings(recentRes.data);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setMeetingsLoading(false);
    }
  }, []);

  // Fetch data on user load
  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user?.id, fetchMeetings]);

  // Sync selected meeting when list loads
  useEffect(() => {
    if (activeMeetingTab === 'upcoming' && upcomingMeetings.length > 0) {
      setSelectedMeeting(upcomingMeetings[0]);
    } else if (activeMeetingTab === 'previous' && recentMeetings.length > 0) {
      setSelectedMeeting(recentMeetings[0]);
    } else {
      setSelectedMeeting(null);
    }
  }, [activeMeetingTab, upcomingMeetings, recentMeetings]);

  // Action: Create/Start Instant Meeting (Host button)
  const handleStartInstantMeeting = async () => {
    try {
      const title = `${user?.name || 'Aditya Sahu'}'s Meeting`;
      const res = await api.post('/api/meetings/instant', { title });
      const meeting: Meeting = res.data;
      await api.post(`/api/meetings/${meeting.meeting_id}/join`, {
        display_name: user?.name || 'Aditya Sahu',
      });
      toast.success('Starting instant meeting...');
      router.push(`/meeting/${meeting.meeting_id}`);
    } catch {
      toast.error('Failed to start instant meeting');
    }
  };

  // Action: Join Meeting
  const handleJoinMeeting = async (meetingId: string) => {
    try {
      await api.post(`/api/meetings/${meetingId}/join`, {
        display_name: user?.name || 'Aditya Sahu',
      });
      router.push(`/meeting/${meetingId}`);
    } catch {
      router.push(`/meeting/${meetingId}`);
    }
  };

  // Action: Copy Link
  const handleCopyInvite = async (link?: string) => {
    if (!link) return;
    setCopyingLink(true);
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Invite link copied!');
    } catch {
      toast.error('Failed to copy link');
    } finally {
      setTimeout(() => setCopyingLink(false), 1500);
    }
  };

  // Action: Copy PMI
  const handleCopyPMI = async () => {
    setCopyingPMI(true);
    try {
      await navigator.clipboard.writeText('6415907047');
      toast.success('Personal Meeting ID copied!');
    } catch {
      toast.error('Failed to copy ID');
    } finally {
      setTimeout(() => setCopyingPMI(false), 1500);
    }
  };

  // Action: Cancel/Delete Meeting
  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    try {
      await api.delete(`/api/meetings/${meetingId}`);
      toast.success('Meeting cancelled successfully');
      setUpcomingMeetings((prev) => prev.filter((m) => m.meeting_id !== meetingId));
      if (selectedMeeting?.meeting_id === meetingId) {
        setSelectedMeeting(null);
      }
    } catch {
      toast.error('Failed to cancel meeting');
    }
  };

  // Submit Schedule Form
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date) {
      toast.error('Please enter a topic and date');
      return;
    }

    const [hourStr, minStr] = timeHour.split(':');
    let hour = parseInt(hourStr);
    const min = parseInt(minStr);
    if (timeAmPm === 'PM' && hour !== 12) hour += 12;
    if (timeAmPm === 'AM' && hour === 12) hour = 0;

    const formattedHour = String(hour).padStart(2, '0');
    const formattedMin = String(min).padStart(2, '0');
    const start_time = new Date(`${date}T${formattedHour}:${formattedMin}:00`).toISOString();
    const duration = parseInt(durationHr) * 60 + parseInt(durationMin);

    setScheduleLoading(true);
    try {
      const res = await api.post('/api/meetings/schedule', {
        title: topic,
        description: description || undefined,
        start_time,
        duration,
        passcode: passcodeChecked ? passcode : undefined,
      });
      toast.success('Meeting scheduled successfully! 🗓️');
      const scheduledMeeting: Meeting = res.data;
      setUpcomingMeetings((prev) => [scheduledMeeting, ...prev]);
      setSelectedMeeting(scheduledMeeting);
      // Return to meetings list tab
      setActiveTab('meetings');
    } catch (err: unknown) {
      const error = err as { response?: { data?: any }, message?: string };
      const detail = error.response?.data?.detail;
      const errorStr = typeof detail === 'string' ? detail : JSON.stringify(error.response?.data || error.message);
      toast.error(`Error: ${errorStr}`);
    } finally {
      setScheduleLoading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-t-[#0E71EB] border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  const currentMeetingsList = activeMeetingTab === 'upcoming' ? upcomingMeetings : recentMeetings;
  const name = user?.name || 'Aditya Sahu';
  const firstInitial = name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f8] text-[#1A1A1A] select-none font-sans antialiased">
      {/* 1. Global Navbar */}
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* 2. Left Sidebar and Main Content Wrapper */}
      <div className="w-full max-w-[1440px] mx-auto flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-[#F7F9FA] p-[24px] pt-[22px] overflow-x-hidden min-w-0 mt-[72px]">
                {/* VIEW A: HOME / LANDING PAGE */}
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-[28px] items-start w-full max-w-[1440px] mx-auto select-none text-left">
              
              {/* LEFT SIDE COLUMN (occupies remaining width) */}
              <div className="w-full flex flex-col gap-[28px]" style={{ marginTop: '40px' }}>
                  
                  {/* 1. PROFILE CARD */}
                  <div className="bg-white border border-[#e7e9ee] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-[22px] py-[22px] flex items-center justify-around min-h-[102px] h-[102px] select-none text-left">
                    <div className="flex items-center gap-4">
                      {/* Teal Initial Badge */}
                      <div className="w-[64px] h-[64px] rounded-[16px] bg-[#0891b2] text-[34px] font-semibold text-white flex items-center justify-center select-none shrink-0">
                        {firstInitial}
                      </div>
                      {/* User Profile Info */}
                      <div className="flex flex-col justify-center select-none">
                        <h2 className="text-[18px] font-bold leading-[26px] text-[#111827]">{name}</h2>
                        <p className="text-[14px] font-normal text-[#5b6472] mt-[2px]">
                          Plan:{' '}
                          <span className="font-semibold text-[#111827]">Workplace Basic</span>
                        </p>
                      </div>
                    </div>
 
                    {/* Actions Right */}
                    <div className="flex flex-col items-center gap-[10px]">
                      <button className="h-[38px] px-[24px] border border-[#d1d5db] bg-white text-[#1f2937] font-medium text-[14px] rounded-[10px] hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                        Manage Plan
                      </button>
                      <a href="#" className="text-[13px] font-medium text-[#0b5cff] hover:underline cursor-pointer">View Plan Details</a>
                    </div>
                  </div>

                  {/* 2. PROMO CARD (Summer savings) */}
                  <div className="bg-white border border-[#e7e9ee] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] px-[30px] py-[30px] flex flex-col h-[238px] relative overflow-hidden select-none text-left">
                     {/* Main row: text + illustration */}
                     <div className="flex items-center justify-center gap-[30px]">
                       {/* Left Column: blob + text + button */}
                       <div className="max-w-[430px] flex flex-col items-start text-left z-10 relative" style={{ paddingTop: '35px' }}>
                         {/* Blob background */}
                         <div className="absolute -left-[60px] -top-[30px] w-[340px] h-[280px] rounded-full bg-[#ede9fe] opacity-60 blur-2xl pointer-events-none" />
                         <h2 className="text-[28px] font-[700] leading-[32px] mb-[22px] text-[#111827] relative">
                           Summer savings are on!
                         </h2>
                         <p className="text-[15px] leading-[24px] text-[#4b5563] font-normal relative">
                           For a limited time, get 15% off an annual Zoom Workplace Pro plan and unlock meetings up to 30 hours, unlimited AI Companion usage, unlimited AI note-taking with My Notes, and more.
                         </p>
                         <div className="mt-[22px] relative">
                           <button className="h-[38px] px-[24px] rounded-[10px] bg-[#0b5cff] text-white text-[14px] font-semibold inline-flex items-center justify-center hover:bg-[#004BD6] transition-colors focus:outline-none cursor-pointer">
                             Redeem offer
                           </button>
                         </div>
                       </div>

                       {/* Right Column: person illustration */}
                       <div className="w-[220px] hidden md:flex items-center justify-center shrink-0 relative select-none h-full">
                         <div className="w-[220px] h-full flex items-center justify-center">
                           <svg viewBox="0 0 200 240" fill="none" className="w-full max-h-[160px] object-contain">
                             {/* Background light purple gradient blob shape */}
                             <circle cx="110" cy="130" r="80" fill="#F0EEFD" />
                             <path d="M120 70C150 70 170 110 160 140C150 170 100 180 80 160C60 140 70 100 90 80C110 60 90 70 120 70Z" fill="#ECE7FD" opacity="0.8" />
                             {/* Body / Torso */}
                             <path d="M80 135 C88 132, 112 132, 120 135 L125 180 C125 180, 122 210, 122 220 L110 220 L108 178 L102 178 L100 220 L88 220 L85 180 Z" fill="#1A202C" />
                             {/* Shirt / Tee */}
                             <path d="M80 135 L120 135 L124 175 L86 175 Z" fill="#0EA871" />
                             <path d="M78 135 L88 135 L88 152 L76 150 Z" fill="#0EA871" />
                             <path d="M122 135 L112 135 L112 152 L124 150 Z" fill="#0EA871" />
                             {/* Left Hand */}
                             <path d="M78 136 L62 144 C60 145, 55 145, 53 143 C51 141, 52 138, 56 136 L72 130 Z" fill="#EDC5A5" />
                             {/* Right Hand */}
                             <path d="M120 136 L138 152 C141 155, 145 152, 147 150 C149 148, 145 142, 141 138 L124 130 Z" fill="#EDC5A5" />
                             {/* Head */}
                             <circle cx="100" cy="108" r="14" fill="#EDC5A5" />
                             <path d="M86 102 C86 102, 94 92, 108 96 C114 98, 114 104, 114 104 L112 108 L88 108 Z" fill="#2D3748" />
                             {/* Neck */}
                             <rect x="96" y="120" width="8" height="8" fill="#EDC5A5" />
                             {/* Sneakers */}
                             <rect x="88" y="218" width="12" height="6" rx="2" fill="#E2E8F0" />
                             <rect x="100" y="218" width="12" height="6" rx="2" fill="#E2E8F0" />
                           </svg>
                         </div>
                       </div>
                     </div>

                     {/* Terms apply - centered at bottom */}
                     <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 text-center">
                       <span className="text-[13px] text-[#8A8A8A] font-normal">Terms apply.</span>
                     </div>
                   </div>
 
                   {/* 3. RECENT ACTIVITY CARD */}
                   <div className="bg-white border border-[#e7e9ee] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-[290px] overflow-hidden select-none text-left ml-6">
                     <h3 className="text-[28px] font-bold leading-[32px] text-[#111827] pt-[22px] px-[22px] pb-[14px] text-center">
                       Recent activity
                     </h3>
                     <div className="h-[1px] bg-[#eceef2]" />
                     <div className="flex flex-col items-center justify-center h-[calc(100%-58px)] px-[22px]">
                       {/* Isometric Box SVG (Sized exactly 120px) */}
                       <svg viewBox="0 0 120 120" className="w-[120px] h-[120px] mb-[14px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                         {/* Soft shadow below the box */}
                         <ellipse cx="60" cy="100" rx="32" ry="6" fill="#ECEFF3" />
                         
                         {/* Back Inside Panels */}
                         <path d="M30 60 L60 45 L60 75 Z" fill="#0C2D6D" />
                         <path d="M60 45 L90 60 L60 75 Z" fill="#092254" />
                         
                         {/* Exterior Left Panel */}
                         <path d="M30 60 L60 75 L60 100 L30 85 Z" fill="#2F75EC" />
                         
                         {/* Exterior Right Panel */}
                         <path d="M60 75 L90 60 L90 85 L60 100 Z" fill="#1C58CD" />
                         
                         {/* Top/Back Flaps */}
                         <path d="M30 60 L10 50 L38 38 L60 45 Z" fill="#7FAFFF" />
                         <path d="M90 60 L110 50 L82 38 L60 45 Z" fill="#6097FB" />
                         
                         {/* Front-Left Hanging Flap */}
                         <path d="M30 60 L14 78 L44 93 L60 75 Z" fill="#9FC2FF" />
                         
                         {/* Front-Right Hanging Flap */}
                         <path d="M90 60 L106 78 L76 93 L60 75 Z" fill="#7EAFFF" />
                       </svg>
                       <span className="text-[16px] font-medium text-[#4b5563]">No recent activity</span>
                     </div>
                   </div>
 
              </div>
  
              {/* RIGHT SIDE COLUMN (fixed 320px on desktop) */}
              <div className="w-[320px] min-w-[320px] flex flex-col gap-[28px] shrink-0 mr-[64px]" style={{ marginTop: '40px' }}>
                  
                  {/* 4. ACTIONS GRID CARD */}
                  <div className="bg-white border border-[#e7e9ee] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] py-[22px] px-[18px] select-none text-left">
                    {/* Grid row of 3 main quick buttons */}
                    <div className="grid grid-cols-3 gap-[14px] text-center px-[8px]">
                      {/* Action Schedule */}
                      <button
                        onClick={() => setActiveTab('schedule')}
                        className="flex flex-col items-center group focus:outline-none cursor-pointer w-full"
                      >
                        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#0b5cff] group-hover:bg-[#004BD6] text-white flex items-center justify-center transition-colors relative shadow-[0_1px_2px_rgba(0,0,0,0.03)] mx-auto mb-[10px]">
                          <Calendar className="w-[18px] h-[18px] stroke-[2.2] text-white" />
                          <span className="absolute text-[8px] font-bold text-[#0b5cff] top-[18px] left-[18px] leading-none">19</span>
                        </div>
                        <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#111827] transition-colors">
                          Schedule
                        </span>
                      </button>
 
                      {/* Action Join */}
                      <button
                        onClick={() => setShowJoin(true)}
                        className="flex flex-col items-center group focus:outline-none cursor-pointer w-full"
                      >
                        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#0b5cff] group-hover:bg-[#004BD6] text-white flex items-center justify-center transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] mx-auto mb-[10px]">
                          <Plus className="w-[18px] h-[18px] stroke-[2.5]" />
                        </div>
                        <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#111827] transition-colors">
                          Join
                        </span>
                      </button>
 
                      {/* Action Host */}
                      <button
                        onClick={handleStartInstantMeeting}
                        className="flex flex-col items-center group focus:outline-none cursor-pointer w-full"
                      >
                        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#ff6600] group-hover:bg-[#E55A00] text-white flex items-center justify-center transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] mx-auto mb-[10px]">
                          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white text-white">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                          </svg>
                        </div>
                        <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#111827] transition-colors">
                          Host
                        </span>
                      </button>
                    </div>
 
                    {/* Personal Meeting ID Widget */}
                    <div className="mt-[36px] border-t border-[#eceef2] pt-[24px] pb-[4px] select-none text-center">
                      <span className="text-[14px] font-bold text-[#111827] block text-center mb-[6px]">Personal Meeting ID</span>
                      <button
                        onClick={handleCopyPMI}
                        className="inline-flex items-center gap-[14px] py-1.5 px-3 rounded-[8px] hover:bg-[#F8F9FA] transition-colors cursor-pointer text-[#1A1A1A] focus:outline-none border border-transparent hover:border-[#e7e9ee] mx-auto"
                      >
                        <span className="text-[15px] tracking-[0.12em] text-[16px] font-normal select-text text-[#374151]">641 590 7047</span>
                        <Copy className="w-4 h-4 text-[#8A8A8A] shrink-0" />
                      </button>
                    </div>
                  </div>
 
                  {/* 5. MEETINGS QUICK-VIEW CARD */}
                  <div className="bg-white border border-[#e7e9ee] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] select-none text-left" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between mb-[12px]">
                      <h3 className="text-[28px] font-bold leading-[32px] text-[#111827]">Meetings</h3>
                      <button
                        onClick={() => setActiveTab('meetings')}
                        className="text-[14px] font-semibold text-[#0E71EB] hover:underline cursor-pointer focus:outline-none"
                      >
                        Visit Meetings
                      </button>
                    </div>
 
                    {/* Meeting Empty State */}
                    <div className="h-[44px] rounded-[8px] bg-[#f9fafb] flex items-center px-[14px] text-[14px] font-bold text-[#374151]">
                      No Upcoming Meetings
                    </div>
 
                    {/* Audio and Video Test Button */}
                    <div className="flex items-center justify-center" style={{ marginTop: '4px' }}>
                      <button
                        onClick={() => alert('Launching Zoom speaker and mic diagnostic environment...')}
                        className="h-[38px] px-[16px] border border-[#d1d5db] rounded-[6px] text-[14px] bg-white font-medium hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
                      >
                        Test Audio and Video
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          )}

            {/* VIEW B: MEETINGS SPLIT-PANEL PAGE */}
            {activeTab === 'meetings' && (
              <div className="flex-1 flex overflow-hidden bg-white min-h-[550px] relative select-none">
                
                {/* LEFT COLUMN — MEETINGS LIST */}
                <div className="w-[340px] border-r border-[#e7e9ee] flex flex-col flex-shrink-0 bg-white overflow-hidden min-h-0">
                  {/* Tab Bar */}
                  <div className="h-11 border-b border-[#e7e9ee] flex items-center gap-4 bg-white flex-shrink-0 select-none pl-6">
                    <button
                      onClick={() => setActiveMeetingTab('upcoming')}
                      className={`h-full px-4 text-[14px] font-medium transition-all cursor-pointer flex items-center justify-center relative ${
                        activeMeetingTab === 'upcoming'
                          ? 'text-[#1A1A1A] font-bold'
                          : 'text-[#747487] hover:text-[#1A1A1A]'
                      }`}
                    >
                      Upcoming
                      {activeMeetingTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0E71EB] rounded-t" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveMeetingTab('previous')}
                      className={`h-full px-4 text-[14px] font-medium transition-all cursor-pointer flex items-center justify-center relative ${
                        activeMeetingTab === 'previous'
                          ? 'text-[#1A1A1A] font-bold'
                          : 'text-[#747487] hover:text-[#1A1A1A]'
                      }`}
                    >
                      Previous
                      {activeMeetingTab === 'previous' && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0E71EB] rounded-t" />
                      )}
                    </button>
                  </div>

                  {/* List scroll container */}
                  <div className="flex-1 overflow-y-auto divide-y divide-[#F0F2F4] bg-white select-none">
                    {meetingsLoading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center gap-3">
                            <div className="w-12 h-10 bg-gray-100 rounded-md" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-gray-100 rounded w-3/4" />
                              <div className="h-2.5 bg-gray-50 rounded w-1/2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : currentMeetingsList.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#747487] font-semibold select-none">
                        No {activeMeetingTab} meetings
                      </div>
                    ) : (
                      currentMeetingsList.map((m) => {
                        const startTime = new Date(m.start_time);
                        const isHost = m.host_id === user?.id;
                        const isSelected = selectedMeeting?.meeting_id === m.meeting_id;
                        return (
                          <div
                            key={m.meeting_id}
                            onClick={() => setSelectedMeeting(m)}
                            className={`h-[76px] pl-10 pr-6 flex items-center gap-3 transition-colors cursor-pointer select-none relative ${
                              isSelected ? 'bg-[#E8F0FE]' : 'hover:bg-[#F8F9FA]'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0E71EB] rounded-r" />
                            )}

                            {/* Time Column */}
                            <div className="w-[54px] flex-shrink-0 text-left">
                              <span className="text-[14px] font-bold text-[#1A1A1A] block leading-tight">
                                {format(startTime, 'h:mm')}
                              </span>
                              <span className="text-[11px] text-[#747487] font-bold block leading-tight mt-0.5">
                                {format(startTime, 'a')}
                              </span>
                            </div>

                            {/* Meeting Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-[14px] font-bold text-[#1A1A1A] truncate leading-tight mb-1">
                                {m.title}
                              </h4>
                              <p className="text-[12px] text-[#747487] truncate leading-tight font-medium">
                                ID: {m.meeting_id} · Host:{' '}
                                <span className="font-semibold">{m.host_name}</span>
                                {isHost && <span className="text-[#0E71EB] font-bold ml-0.5">(You)</span>}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN — MEETING DETAIL PANEL */}
                <div className="flex-1 bg-white overflow-y-auto relative select-none flex flex-col items-center pt-20">
                  {/* Float action button to go to scheduling page from meetings view */}
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="absolute top-6 right-6 h-9 px-4 bg-[#0E71EB] hover:bg-[#005BCC] text-white text-[13px] font-bold rounded-[6px] flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Meeting</span>
                  </button>

                  {selectedMeeting ? (
                    <div className="p-10 text-left select-none w-full max-w-2xl mx-auto flex flex-col">
                      {/* Meeting title */}
                      <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1.5 leading-tight tracking-tight select-text">
                        {selectedMeeting.title}
                      </h2>
                      
                      {/* Date/time line */}
                      <p className="text-[14px] text-[#747487] mb-6 font-bold select-text">
                        {format(new Date(selectedMeeting.start_time), 'EEEE, MMMM d, yyyy · h:mm a')}
                      </p>

                      {/* Details Section rows */}
                      <div className="space-y-0.5 border-t border-b border-[#F0F2F4] py-4 mb-8 select-text">
                        <div className="h-9 flex items-center text-[13px]">
                          <span className="w-[120px] text-[#747487] flex-shrink-0 font-medium">Meeting ID</span>
                          <span className="text-[#1A1A1A] font-mono font-bold select-text">{selectedMeeting.meeting_id}</span>
                        </div>
                        {selectedMeeting.passcode && (
                          <div className="h-9 flex items-center text-[13px]">
                            <span className="w-[120px] text-[#747487] flex-shrink-0 font-medium">Passcode</span>
                            <span className="text-[#1A1A1A] font-mono font-bold select-text">{selectedMeeting.passcode}</span>
                          </div>
                        )}
                        <div className="h-9 flex items-center text-[13px]">
                          <span className="w-[120px] text-[#747487] flex-shrink-0 font-medium">Host</span>
                          <span className="text-[#1A1A1A] select-text font-medium">
                            {selectedMeeting.host_name}
                            {selectedMeeting.host_id === user?.id && (
                              <span className="text-[#0E71EB] font-bold ml-1">(You)</span>
                            )}
                          </span>
                        </div>
                        <div className="h-9 flex items-center text-[13px]">
                          <span className="w-[120px] text-[#747487] flex-shrink-0 font-medium">Duration</span>
                          <span className="text-[#1A1A1A] font-medium">
                            {selectedMeeting.duration < 60
                              ? `${selectedMeeting.duration} minutes`
                              : `${selectedMeeting.duration / 60} hour${selectedMeeting.duration > 60 ? 's' : ''}`}
                          </span>
                        </div>
                        {selectedMeeting.invite_link && (
                          <div className="h-9 flex items-center text-[13px]">
                            <span className="w-[120px] text-[#747487] flex-shrink-0 font-medium">Meeting Link</span>
                            <a
                              onClick={() => handleCopyInvite(selectedMeeting.invite_link)}
                              className="text-[#0E71EB] hover:underline cursor-pointer select-text truncate font-bold"
                            >
                              {selectedMeeting.invite_link}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-3">
                        {!isPast(new Date(selectedMeeting.start_time)) && selectedMeeting.status !== 'completed' ? (
                          <>
                            <button
                              onClick={() => handleJoinMeeting(selectedMeeting.meeting_id)}
                              className="bg-[#0E71EB] hover:bg-[#005BCC] text-white h-9 px-6 rounded-[6px] text-sm font-bold transition-colors cursor-pointer focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] shadow-blue-500/10"
                            >
                              {selectedMeeting.host_id === user?.id ? 'Start' : 'Join'}
                            </button>

                            <button
                              onClick={() => handleCopyInvite(selectedMeeting.invite_link)}
                              className="bg-white border border-[#CBD5E1] hover:border-gray-400 text-[#1A1A1A] h-9 px-5 rounded-[6px] text-sm font-bold transition-colors cursor-pointer focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                            >
                              {copyingLink ? 'Copied' : 'Copy Invitation'}
                            </button>

                            {selectedMeeting.host_id === user?.id && (
                              <button
                                onClick={() => handleDeleteMeeting(selectedMeeting.meeting_id)}
                                className="bg-white border border-[#FF3B30] hover:bg-red-50 text-[#FF3B30] h-9 px-5 rounded-[6px] text-sm font-bold transition-colors cursor-pointer focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-[12px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full select-none">
                            This meeting has completed/ended
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* EMPTY STATE */
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 select-none">
                      <CalendarDays className="w-12 h-12 text-[#D0D2DE] mb-3" strokeWidth={1.5} />
                      <p className="text-[13px] text-[#747487] font-bold">Select a meeting to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW C: Schedule meeting */}
            {activeTab === 'schedule' && (
              <div className="flex-1 bg-white overflow-y-auto" style={{ padding: '26px 32px 40px 32px' }}>
                <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
                  <span
                    onClick={() => setActiveTab('home')}
                    className="text-[14px] font-[600] text-[#0b5cff] hover:underline cursor-pointer block select-none mb-4"
                  >
                    &lt; Back to Meetings
                  </span>
                  
                  <h2 style={{ fontSize: '28px', fontWeight: 700, lineHeight: '36px', color: '#111827', marginBottom: '18px' }}>
                    Schedule Meeting
                  </h2>

                  <div style={{ background: 'white', border: '1px solid #e7e9ee', borderRadius: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', padding: '32px' }}>
                    
                    <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="select-none">
                      
                      {/* Topic */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Topic <span className="text-[#FF3B30]">*</span>
                        </label>
                        <div className="flex-1" style={{ width: '100%' }}>
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-medium"
                          />
                          {!showDescription ? (
                            <button
                              type="button"
                              onClick={() => setShowDescription(true)}
                              className="text-[14px] text-[#0b5cff] hover:underline mt-2 flex items-center gap-1 font-[600] cursor-pointer focus:outline-none"
                            >
                              + Add Description
                            </button>
                          ) : (
                            <div className="mt-3">
                              <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter description here..."
                                rows={2}
                                style={{ padding: '14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                                className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow resize-none text-[#111827] font-medium"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* When */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          When
                        </label>
                        <div className="flex-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                          <input
                            type="date"
                            value={date}
                            min={todayStr}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500]"
                          />
                          <select
                            value={timeHour}
                            onChange={(e) => setTimeHour(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                          >
                            {['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00'].map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <select
                            value={timeAmPm}
                            onChange={(e) => setTimeAmPm(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Duration
                        </label>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <select
                                value={durationHr}
                                onChange={(e) => setDurationHr(e.target.value)}
                                style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '90px' }}
                                className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                              >
                                {['0', '1', '2', '3', '4'].map((hr) => (
                                  <option key={hr} value={hr}>{hr}</option>
                                ))}
                              </select>
                              <span style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>hr</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={durationMin}
                                onChange={(e) => setDurationMin(e.target.value)}
                                style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '90px' }}
                                className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                              >
                                {['15', '30', '40', '45'].map((min) => (
                                  <option key={min} value={min}>{min}</option>
                                ))}
                              </select>
                              <span style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>min</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 bg-[#FFF8EC] border border-[#FDE8C9] rounded-[8px] p-4 text-[14px] text-[#A66300] flex items-start gap-2.5 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-[600px]">
                            <span className="text-[16px] select-none mt-0.5 leading-none">⚠️</span>
                            <div className="leading-relaxed">
                              <span>You can schedule meetings for up to 40 minutes each with your current Basic plan. Need more time? </span>
                              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0b5cff] hover:underline font-[600]">
                                Upgrade to Zoom Workplace Pro
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Time Zone */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Time Zone
                        </label>
                        <div className="flex-1">
                          <select
                            value={timeZone}
                            onChange={(e) => setTimeZone(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                          >
                            <option value="(GMT-7:00) Pacific Time (US and Canada)">(GMT-7:00) Pacific Time (US and Canada)</option>
                            <option value="(GMT+5:30) India Standard Time">(GMT+5:30) India Standard Time</option>
                            <option value="(GMT+0:00) Greenwich Mean Time">(GMT+0:00) Greenwich Mean Time</option>
                          </select>
                          <div className="flex items-center gap-2 mt-4">
                            <input
                              id="schedule-recurring"
                              type="checkbox"
                              checked={recurring}
                              onChange={(e) => setRecurring(e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                              className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                            />
                            <label htmlFor="schedule-recurring" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                              Recurring meeting
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Invitees */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Invitees
                        </label>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={invitees}
                            onChange={(e) => setInvitees(e.target.value)}
                            placeholder="Enter user names or email addresses"
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-medium"
                          />
                          <div className="mt-4 bg-[#FFF8EC] border border-[#FDE8C9] rounded-[8px] p-4 text-[14px] text-[#A66300] flex items-start gap-2.5 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-[600px]">
                            <span className="text-[16px] select-none mt-0.5 leading-none">⚠️</span>
                            <div className="leading-relaxed">
                              <span>Participants won't receive this meeting invite until your calendar is connected. </span>
                              <a href="#" onClick={(e) => e.preventDefault()} className="text-[#0b5cff] hover:underline font-[600]">
                                Connect calendar
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: '#eceef2', margin: '26px 0' }} />

                      {/* Meeting ID */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] flex-shrink-0">
                          Meeting ID
                        </label>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                          <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                            <input
                              type="radio"
                              name="meetingIdType"
                              checked={meetingIdType === 'auto'}
                              onChange={() => setMeetingIdType('auto')}
                              style={{ width: '16px', height: '16px', marginRight: '10px' }}
                              className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                            />
                            Generate Automatically
                          </label>
                          <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                            <input
                              type="radio"
                              name="meetingIdType"
                              checked={meetingIdType === 'pmi'}
                              onChange={() => setMeetingIdType('pmi')}
                              style={{ width: '16px', height: '16px', marginRight: '10px' }}
                              className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                            />
                            Personal Meeting ID 641 590 7047
                          </label>
                        </div>
                      </div>

                      {/* Template */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Template
                        </label>
                        <div className="flex-1">
                          <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '100%' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer"
                          >
                            <option value="">Select a template</option>
                            <option value="standup">Daily Scrum/Standup Template</option>
                            <option value="webinar">Large Webinar Template</option>
                          </select>
                        </div>
                      </div>

                      {/* Whiteboard */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] flex-shrink-0 flex items-center gap-1">
                          Whiteboard
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </label>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => alert('Feature integration pending...')}
                            style={{ height: '42px', padding: '0 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827' }}
                            className="flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Laptop className="w-4 h-4" />
                            Add Whiteboard
                          </button>
                        </div>
                      </div>

                      {/* Docs */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] flex-shrink-0 flex items-center gap-1">
                          Docs
                        </label>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => alert('Feature integration pending...')}
                            style={{ height: '42px', padding: '0 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827' }}
                            className="flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                            Add Docs
                          </button>
                        </div>
                      </div>

                      {/* Security Section */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }} className="md:w-[200px] flex-shrink-0">
                          Security
                        </label>
                        <div className="flex-1 flex flex-col gap-[20px]">
                          {/* Passcode */}
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                id="sec-passcode"
                                type="checkbox"
                                checked={passcodeChecked}
                                onChange={(e) => setPasscodeChecked(e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                                className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                              />
                              <label htmlFor="sec-passcode" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                                Passcode
                              </label>
                              <input
                                type="text"
                                value={passcode}
                                onChange={(e) => setPasscode(e.target.value)}
                                disabled={!passcodeChecked}
                                style={{ height: '42px', padding: '0 14px', background: passcodeChecked ? 'white' : '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '140px', marginLeft: '10px' }}
                                className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-medium disabled:text-gray-400"
                              />
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginLeft: '26px' }}>
                              Only users who have the invite link or passcode can join the meeting
                            </p>
                          </div>

                          {/* Waiting Room */}
                          <div>
                            <div className="flex items-center gap-2">
                              <input
                                id="sec-waiting"
                                type="checkbox"
                                checked={waitingRoomChecked}
                                onChange={(e) => setWaitingRoomChecked(e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                                className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                              />
                              <label htmlFor="sec-waiting" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                                Waiting Room
                              </label>
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginLeft: '26px' }}>
                              Only users admitted by the host can join the meeting
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Encryption */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }} className="md:w-[200px] flex-shrink-0">
                          Encryption
                        </label>
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-6">
                          <label className="flex items-center gap-1.5 font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                            <input
                              type="radio"
                              name="encryption"
                              checked={encryption === 'enhanced'}
                              onChange={() => setEncryption('enhanced')}
                              style={{ width: '16px', height: '16px', marginRight: '6px' }}
                              className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                            />
                            <Shield className="w-4 h-4 text-green-600 fill-green-600/10" />
                            <span>Enhanced encryption</span>
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          </label>

                          <label className="flex items-center gap-1.5 font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                            <input
                              type="radio"
                              name="encryption"
                              checked={encryption === 'e2e'}
                              onChange={() => setEncryption('e2e')}
                              style={{ width: '16px', height: '16px', marginRight: '6px' }}
                              className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                            />
                            <Shield className="w-4 h-4 text-green-700 fill-green-700/30" />
                            <span>End-to-end encryption</span>
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                          </label>
                        </div>
                      </div>

                      {/* AI Companion */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }} className="md:w-[200px] flex-shrink-0">
                          AI Companion
                        </label>
                        <div className="flex-1 flex flex-col gap-[12px]">
                          <div className="flex items-center gap-2">
                            <input
                              id="ai-companion"
                              type="checkbox"
                              checked={aiCompanionChecked}
                              onChange={(e) => setAiCompanionChecked(e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                              className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                            />
                            <label htmlFor="ai-companion" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                              Automatically start AI Companion
                            </label>
                            <Info className="w-4 h-4 text-gray-400" />
                          </div>

                          <div className="pl-7 space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                id="ai-questions"
                                type="checkbox"
                                checked={autoSummaryQuestionsChecked}
                                onChange={(e) => setAutoSummaryQuestionsChecked(e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                                className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                              />
                              <label htmlFor="ai-questions" style={{ fontSize: '14px', color: '#4b5563', marginLeft: '10px' }} className="font-medium cursor-pointer">
                                Automatically start meeting questions
                              </label>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                id="ai-summary"
                                type="checkbox"
                                checked={autoSummaryTextChecked}
                                onChange={(e) => setAutoSummaryTextChecked(e.target.checked)}
                                style={{ width: '16px', height: '16px' }}
                                className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                              />
                              <label htmlFor="ai-summary" style={{ fontSize: '14px', color: '#4b5563', marginLeft: '10px' }} className="font-medium cursor-pointer">
                                Automatically start meeting summary
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Summary Template */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 relative">
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }} className="md:w-[200px] md:pt-3 flex-shrink-0">
                          Meeting summary template
                        </label>
                        <div className="flex-1">
                          <select
                            value={summaryTemplate}
                            onChange={(e) => setSummaryTemplate(e.target.value)}
                            style={{ height: '42px', padding: '0 14px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '280px' }}
                            className="focus:outline-none focus:border-[#0b5cff] focus:ring-[3px] focus:ring-[#0b5cff]/12 transition-shadow text-[#111827] font-[500] cursor-pointer block"
                          >
                            <option value="General template">General template</option>
                            <option value="Custom template">Custom template</option>
                          </select>
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] text-[#0b5cff] hover:underline font-[600] mt-2 block">
                            Change default summary template ↗
                          </a>
                          
                          {/* Floating NEW Popover Tooltip Badge card */}
                          {showSummaryPopover && (
                            <div className="absolute top-[-26px] left-[290px] w-[290px] bg-white border border-[#CBD5E1]/80 rounded-xl shadow-2xl p-4 animate-scale-in select-none z-20">
                              <div className="absolute left-[-6px] top-[40px] w-3 h-3 bg-white border-l border-b border-[#CBD5E1]/80 rotate-45" />
                              <div className="flex items-center justify-between pb-1.5 border-b border-gray-50 mb-2 select-none">
                                <span className="bg-[#E8F0FE] text-[#0E71EB] text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider leading-none uppercase">
                                  NEW
                                </span>
                                <h4 className="text-[13px] font-bold text-gray-900 flex-1 ml-2 text-left">
                                  Meeting summary template
                                </h4>
                                <X className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={() => setShowSummaryPopover(false)} />
                              </div>
                              <p className="text-[12px] text-gray-600 leading-normal text-left font-medium select-none">
                                You can now select a summary template based on different meeting types.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Workflow */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }} className="md:w-[200px] flex-shrink-0">
                          Workflow
                        </label>
                        <div className="flex-1">
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] text-[#0b5cff] hover:underline font-[600]">
                            Attach workflow to this meeting
                          </a>
                        </div>
                      </div>

                      {/* My Notes */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }} className="md:w-[200px] flex-shrink-0">
                          My notes
                        </label>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              id="my-notes"
                              type="checkbox"
                              checked={myNotesChecked}
                              onChange={(e) => setMyNotesChecked(e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                              className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                            />
                            <label htmlFor="my-notes" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                              Allow everyone to use meeting transcript with My notes
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Chat */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }} className="md:w-[200px] flex-shrink-0">
                          Meeting chat
                        </label>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              id="meeting-chat"
                              type="checkbox"
                              checked={meetingChatChecked}
                              onChange={(e) => setMeetingChatChecked(e.target.checked)}
                              style={{ width: '16px', height: '16px' }}
                              className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                            />
                            <label htmlFor="meeting-chat" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px' }} className="font-medium cursor-pointer">
                              Enable Continuous Meeting Chat
                            </label>
                            <Info className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Video Section */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }} className="md:w-[200px] flex-shrink-0">
                          Video
                        </label>
                        <div className="flex-1 flex flex-col gap-[20px]">
                          <div className="flex items-center gap-6">
                            <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600, width: '80px' }}>Host</span>
                            <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                              <input
                                type="radio"
                                name="videoHost"
                                checked={videoHost === 'on'}
                                onChange={() => setVideoHost('on')}
                                style={{ width: '16px', height: '16px', marginRight: '10px' }}
                                className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                              />
                              on
                            </label>
                            <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                              <input
                                type="radio"
                                name="videoHost"
                                checked={videoHost === 'off'}
                                onChange={() => setVideoHost('off')}
                                style={{ width: '16px', height: '16px', marginRight: '10px' }}
                                className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                              />
                              off
                            </label>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <span style={{ fontSize: '14px', color: '#111827', fontWeight: 600, width: '80px' }}>Participant</span>
                            <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                              <input
                                type="radio"
                                name="videoParticipant"
                                checked={videoParticipant === 'on'}
                                onChange={() => setVideoParticipant('on')}
                                style={{ width: '16px', height: '16px', marginRight: '10px' }}
                                className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                              />
                              on
                            </label>
                            <label className="flex items-center font-medium cursor-pointer" style={{ fontSize: '14px', color: '#111827' }}>
                              <input
                                type="radio"
                                name="videoParticipant"
                                checked={videoParticipant === 'off'}
                                onChange={() => setVideoParticipant('off')}
                                style={{ width: '16px', height: '16px', marginRight: '10px' }}
                                className="border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff]"
                              />
                              off
                            </label>
                          </div>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: '#eceef2', margin: '26px 0' }} />

                      {/* Options */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }} className="md:w-[200px] flex-shrink-0">
                          Options
                        </label>
                        <div className="flex-1">
                          <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] text-[#0b5cff] hover:underline font-[600]">
                            Show
                          </a>
                        </div>
                      </div>

                      {/* Interpretation */}
                      <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 mt-2">
                        <label style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }} className="md:w-[200px] flex-shrink-0">
                          Interpretation
                        </label>
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <input
                              id="interpretation"
                              type="checkbox"
                              checked={interpretationChecked}
                              onChange={(e) => setInterpretationChecked(e.target.checked)}
                              style={{ width: '16px', height: '16px', marginTop: '2px' }}
                              className="rounded border-gray-300 text-[#0b5cff] focus:ring-[#0b5cff] cursor-pointer"
                            />
                            <label htmlFor="interpretation" style={{ fontSize: '14px', color: '#111827', marginLeft: '10px', lineHeight: '1.5' }} className="font-medium cursor-pointer">
                              Select sign language interpretation video channels below. You can assign interpreters at any time.
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-[12px] pt-[26px]">
                        <button
                          type="button"
                          onClick={() => setActiveTab('home')}
                          style={{ height: '42px', padding: '0 24px', background: 'white', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#111827' }}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={scheduleLoading}
                          style={{ height: '42px', padding: '0 24px', background: '#0b5cff', border: '1px solid #0b5cff', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: 'white' }}
                          className="hover:bg-[#005BCC] hover:border-[#005BCC] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center"
                        >
                          {scheduleLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            )}

          </main>
      </div>

      {/* 4. HIGH-FIDELITY CORPORATE DARK FOOTER */}
      <Footer />

      {/* Floating Chat bot badge lower right corner (mockup of Zoom chatbot assist icon) */}
      <button
        onClick={() => alert('Zoom Virtual AI Assistant environment initialization...')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#0E71EB] hover:bg-[#005BCC] text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-50 focus:outline-none"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white text-white" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm0-3h12v2H6V6zm0 6h9v2H6v-2z" />
        </svg>
      </button>

      {/* JOIN MODAL */}
      {showJoin && (
        <JoinModal onClose={() => setShowJoin(false)} />
      )}
    </div>
  );
}
