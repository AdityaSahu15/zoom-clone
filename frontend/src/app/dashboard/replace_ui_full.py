import re

with open('page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* VIEW C: Schedule meeting */}"
end_marker = "</main>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    new_jsx = """{/* VIEW C: Schedule meeting */}
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
                          
                          <div className="mt-4 bg-[#FFF8EC] border border-[#FDE8C9] rounded-[8px] p-4 text-[14px] text-[#A66300] flex items-start gap-2.5 select-none shadow-sm max-w-[600px]">
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
                          <div className="mt-4 bg-[#FFF8EC] border border-[#FDE8C9] rounded-[8px] p-4 text-[14px] text-[#A66300] flex items-start gap-2.5 select-none shadow-sm max-w-[600px]">
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
                                <span className="bg-[#E8F0FE] text-[#0E71EB] text-[10px] font-extrabold px-1.5 py-0.5 rounded-[4px] tracking-wider leading-none uppercase">
                                  NEW
                                </span>
                                <h4 className="text-[13px] font-extrabold text-gray-900 flex-1 ml-2 text-left">
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
"""
    new_content = content[:start_idx] + new_jsx + "\n          " + content[end_idx:]
    with open('page.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    print("MARKER NOT FOUND")
