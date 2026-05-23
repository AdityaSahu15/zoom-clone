'use client';

import { useState, useEffect, useCallback, use, useRef, CSSProperties } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare,
  Users, Phone, Shield, MoreHorizontal, Copy, Grid,
  Volume2, VolumeX, ChevronUp, Smile, Circle, PhoneOff,
  Heart, Sparkles, X, Search
} from 'lucide-react';
import api from '@/lib/api';
import { Participant, Meeting } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// ─── Participant Tile ─────────────────────────────────────────────────────────
function ParticipantTile({
  participant,
  isCurrentUser,
  localMuteState,
  localVideoState,
  isSingle,
  style,
}: {
  participant: Participant;
  isCurrentUser: boolean;
  localMuteState: boolean;
  localVideoState: boolean;
  isSingle?: boolean;
  style?: CSSProperties;
}) {
  const muted = isCurrentUser ? localMuteState : participant.is_muted;
  const videoOn = isCurrentUser ? localVideoState : participant.is_video_on;

  // Simulate speaking state for visual polish
  const isSpeaking = !muted && participant.id % 2 === 1;

  return (
    <div 
      className={`relative bg-[#1A1A1A] overflow-hidden flex items-center justify-center transition-all duration-200 ${
        isSpeaking ? 'ring-2 ring-[#2EAD5E]' : ''
      } w-full h-full`}
      style={style}
    >
      {/* Profile Avatar (When Video is off or simulated) */}
      {!videoOn ? (
        <div className="w-[84px] h-[84px] bg-[#008299] flex items-center justify-center select-none shadow-md">
          <span className="text-white text-[42px] font-medium tracking-normal leading-none select-none">
            {participant.display_name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#151515]">
          {/* Simulated Active Video Feed */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-500 via-gray-900 to-black animate-pulse" />
          <div className="w-[84px] h-[84px] bg-[#008299] flex items-center justify-center text-white text-[42px] font-medium select-none shadow-md z-10">
            {participant.display_name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Bottom Name Badge */}
      <div className={`absolute select-none z-10 ${isSingle ? 'bottom-6 left-6' : 'bottom-1 left-1'}`}>
        <div className={`bg-[#000000]/70 px-2 py-[3px] text-[11px] text-white font-medium flex items-center gap-1 shadow-sm ${isSingle ? 'rounded-[4px]' : 'rounded-tr-[3px]'}`}>
          {muted && (
            <MicOff className="w-3.5 h-3.5 text-[#FF3B30] stroke-[2.5]" />
          )}
          <span>
            {participant.display_name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Participants Panel ───────────────────────────────────────────────────────
function ParticipantsPanel({
  participants,
  meetingId,
  isHost,
  currentUserId,
  onMuteAll,
  onRefresh,
}: {
  participants: Participant[];
  meetingId: string;
  isHost: boolean;
  currentUserId?: number;
  onMuteAll: () => void;
  onRefresh: () => void;
}) {
  const handleRemove = async (participantId: number) => {
    try {
      await api.delete(`/api/meetings/${meetingId}/participants/${participantId}`);
      toast.success('Participant removed');
      onRefresh();
    } catch {
      toast.error('Failed to remove participant');
    }
  };

  const handleToggleMute = async (participantId: number, currentlyMuted: boolean) => {
    try {
      await api.patch(`/api/meetings/${meetingId}/participants/${participantId}/mute`, {
        is_muted: !currentlyMuted,
      });
      onRefresh();
    } catch {
      toast.error('Failed to update mute status');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1C1C1E] select-none text-white">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="font-semibold text-sm">
          Participants ({participants.length})
        </h3>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 border border-white/10">
              <span className="text-white text-xs font-bold">
                {p.display_name.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Name + Role */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {p.display_name}
                {p.user_id === currentUserId && (
                  <span className="text-gray-400 ml-1">(Me)</span>
                )}
              </p>
              {p.role === 'host' && (
                <p className="text-[10px] text-gray-400">Host</p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {p.is_muted ? (
                <MicOff className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-gray-300" />
              )}

              {/* Host actions on hover */}
              {isHost && p.role !== 'host' && (
                <div className="hidden group-hover:flex items-center gap-1 bg-[#1C1C1E] pl-1">
                  <button
                    id={`mute-participant-${p.id}`}
                    onClick={() => handleToggleMute(p.id, p.is_muted)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title={p.is_muted ? 'Unmute' : 'Mute'}
                  >
                    {p.is_muted ? (
                      <Volume2 className="w-3.5 h-3.5 text-gray-300" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-gray-300" />
                    )}
                  </button>
                  <button
                    id={`remove-participant-${p.id}`}
                    onClick={() => handleRemove(p.id)}
                    className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    title="Remove from meeting"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-500 rotate-135" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Mute All */}
      {isHost && (
        <div className="p-3 border-t border-white/5 bg-[#161618] flex items-center justify-end">
          <button
            id="mute-all-btn"
            onClick={onMuteAll}
            className="text-xs bg-[#242426] hover:bg-[#323235] text-white border border-white/10 px-3 py-1.5 rounded font-semibold transition-colors"
          >
            Mute All
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Meeting Room ────────────────────────────────────────────────────────
export default function MeetingRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id: meetingId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  // Local UI state (matching muted/video-off screenshot settings)
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [activePanel, setActivePanel] = useState<'participants' | 'chat' | null>(null);
  const [showMeetingInfo, setShowMeetingInfo] = useState(false);
  const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [activeInviteTab, setActiveInviteTab] = useState<'contacts' | 'zoomrooms' | 'email'>('contacts');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // ResizeObserver state for widescreen letterboxing
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const getTileStyle = (): CSSProperties => {
    if (dimensions.width === 0 || dimensions.height === 0) return {};
    const containerRatio = dimensions.width / dimensions.height;
    const targetRatio = 16 / 9;
    
    if (containerRatio > targetRatio) {
      // Height is the constraint
      return {
        height: `${dimensions.height}px`,
        width: `${dimensions.height * targetRatio}px`,
      };
    } else {
      // Width is the constraint
      return {
        width: `${dimensions.width}px`,
        height: `${dimensions.width / targetRatio}px`,
      };
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const [meetingRes, participantsRes] = await Promise.all([
        api.get(`/api/meetings/${meetingId}`),
        api.get(`/api/meetings/${meetingId}/participants`),
      ]);
      setMeeting(meetingRes.data);
      setParticipants(participantsRes.data);
    } catch {
      toast.error('Failed to load meeting');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [meetingId, router]);

  useEffect(() => {
    fetchData();
    // Poll participants every 2 seconds for a real-time feel
    const pollInterval = setInterval(() => {
      api.get(`/api/meetings/${meetingId}/participants`)
        .then((r) => {
          setParticipants(r.data);
          
          // Ejection Detection Check
          if (pid) {
            const me = r.data.find((p: any) => p.id === parseInt(pid, 10));
            if (!me) {
              router.push(`/join?meetingId=${meetingId}&removed=true`);
            }
          }
        })
        .catch((err) => {
          if (err.response?.status === 410) {
            router.push(`/join?meetingId=${meetingId}&ended=true`);
          }
        });
    }, 2000);
    return () => clearInterval(pollInterval);
  }, [fetchData, meetingId]);

  // Meeting timer
  useEffect(() => {
    if (!meeting) return;
    const start = new Date(meeting.start_time);
    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000)));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [meeting]);

  const isHost = meeting?.host_id === user?.id;

  const handleLeaveMeeting = async () => {
    try {
      const url = pid ? `/api/meetings/${meetingId}/leave?participant_id=${pid}` : `/api/meetings/${meetingId}/leave`;
      await api.post(url);
      setShowEndModal(false);
      toast.success('You left the meeting');
      router.push(user ? '/dashboard' : '/');
    } catch {
      router.push(user ? '/dashboard' : '/');
    }
  };

  const handleEndMeeting = async () => {
    try {
      await api.post(`/api/meetings/${meetingId}/end`);
      setShowEndModal(false);
      toast.success('You ended the meeting');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to end meeting');
    }
  };

  const handleMuteAll = async () => {
    try {
      await api.post(`/api/meetings/${meetingId}/mute-all`);
      toast.success('Muted all participants');
      fetchData();
    } catch {
      toast.error('Failed to mute all');
    }
  };

  const copyMeetingLink = async () => {
    if (!meeting?.invite_link) return;
    await navigator.clipboard.writeText(meeting.invite_link);
    toast.success('Meeting link copied!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Joining meeting...</p>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  // Determine grid columns based on participant count
  const gridCols =
    participants.length === 1
      ? 'grid-cols-1 w-full h-full'
      : participants.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 gap-4 p-4'
      : participants.length <= 4
      ? 'grid-cols-2 gap-4 p-4'
      : participants.length <= 6
      ? 'grid-cols-2 lg:grid-cols-3 gap-4 p-4'
      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4';

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden select-none font-sans">
      {/* Top Bar */}
      <div className="h-16 bg-[#080808] flex items-center justify-between pl-6 pr-8 flex-shrink-0 select-none border-b border-white/[0.04]">
        {/* Left: Logo */}
        <div className="flex flex-col items-start leading-none select-none">
          <span className="text-white font-bold text-[22px] tracking-tight">zoom</span>
          <span className="text-white text-[14px] font-medium tracking-normal mt-0.5">Workplace</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4 text-white">
          {/* Security Shield / Info Icon */}
          <div className="relative">
            <div 
              onClick={() => setShowMeetingInfo(!showMeetingInfo)}
              className="w-7 h-7 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-md transition-colors" 
              title="Meeting Information"
            >
              <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#2EAD5E" />
                <path d="M9 11l2 2 4-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            {/* Meeting Info Dropdown */}
            {showMeetingInfo && (
              <div className="absolute top-10 left-0 w-80 bg-white rounded-[12px] shadow-2xl border border-gray-200 z-50 p-5 text-gray-800 font-sans text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg leading-tight tracking-tight text-gray-900 pr-4">{meeting.title}</h3>
                  <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-700 transition-colors" onClick={() => setShowMeetingInfo(false)} />
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500 text-[11px] uppercase font-bold tracking-widest block mb-0.5">Meeting ID</span>
                    <p className="font-mono font-bold text-base text-gray-900 select-text">{meeting.meeting_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[11px] uppercase font-bold tracking-widest block mb-0.5">Host</span>
                    <p className="font-medium text-[14px] text-gray-900 select-text">{meeting.host_name}</p>
                  </div>
                  {meeting.passcode && (
                    <div>
                      <span className="text-gray-500 text-[11px] uppercase font-bold tracking-widest block mb-0.5">Passcode</span>
                      <p className="font-mono font-bold text-base text-gray-900 select-text">{meeting.passcode}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 text-[11px] uppercase font-bold tracking-widest block mb-1">Invite Link</span>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        readOnly 
                        value={meeting.invite_link || ''} 
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-[6px] px-2.5 py-1.5 text-[12px] truncate focus:outline-none select-all text-gray-600"
                      />
                      <button onClick={copyMeetingLink} className="bg-[#0E71EB] hover:bg-[#005BCC] text-white px-3 py-1.5 rounded-[6px] text-[12px] font-bold transition-colors shadow-sm focus:outline-none">
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* View Button */}
          <button className="flex items-center gap-1.5 px-2.5 py-1 hover:bg-white/10 rounded-[4px] text-[12px] font-normal transition-colors cursor-pointer text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>View</span>
          </button>
          
          {/* Maximize Icon */}
          <button className="p-1.5 hover:bg-white/10 rounded-[4px] text-white cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 17H7v-2M15 7h2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-black">
        {/* Video Grid */}
        <div ref={containerRef} className="flex-1 overflow-hidden flex items-center justify-center bg-black">
          {participants.length === 0 ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 animate-pulse">
                <Users className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/75 text-base font-semibold">Waiting for host/others to join</p>
              <p className="text-white/40 text-xs mt-1">Share the invite link to start collaborating</p>
              <button
                onClick={copyMeetingLink}
                className="mt-5 flex items-center gap-2 bg-[#2D8CFF] hover:bg-[#005BCC] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all mx-auto shadow"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </div>
          ) : participants.length === 1 ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <ParticipantTile
                participant={participants[0]}
                isCurrentUser={participants[0].user_id === user?.id}
                localMuteState={isMuted}
                localVideoState={isVideoOn}
                isSingle={true}
              />
            </div>
          ) : (
            <div className={`grid ${gridCols} w-full h-full bg-black`}>
              {participants.map((p) => (
                <ParticipantTile
                  key={p.id}
                  participant={p}
                  isCurrentUser={p.user_id === user?.id}
                  localMuteState={isMuted}
                  localVideoState={isVideoOn}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="w-72 lg:w-80 bg-[#161618] border-l border-white/5 flex-shrink-0 flex flex-col">
            {activePanel === 'participants' && (
              <ParticipantsPanel
                participants={participants}
                meetingId={meetingId}
                isHost={isHost}
                currentUserId={user?.id}
                onMuteAll={handleMuteAll}
                onRefresh={fetchData}
              />
            )}
            {activePanel === 'chat' && (
              <div className="flex flex-col h-full bg-[#1C1C1E] text-white">
                <div className="p-4 border-b border-white/5">
                  <h3 className="font-semibold text-sm">Meeting Chat</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <MessageSquare className="w-10 h-10 text-white/10 mb-3" />
                  <p className="text-white/60 font-semibold text-xs">Chat Coming Soon</p>
                  <p className="text-white/30 text-[10px] mt-1 max-w-[200px]">Real-time message routing is being verified.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-[#080808] h-[68px] flex-shrink-0 flex items-center justify-between px-6 select-none border-t border-white/[0.04]">
        
        {/* Left Controls (Audio/Video with Chevrons) */}
        <div className="flex items-center gap-1.5 w-[22%] justify-start">
          {/* 1. Mute/Unmute Button */}
          <button
            id="toggle-mute"
            onClick={() => setIsMuted(!isMuted)}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-center h-5">
              {isMuted ? (
                /* Custom MicOff: White mic outline with red slash */
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white relative">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                  <line x1="2" x2="22" y1="2" y2="22" stroke="#FF3B30" strokeWidth="2.5" />
                </svg>
              ) : (
                <Mic className="w-[22px] h-[22px] text-white stroke-[2]" />
              )}
              <ChevronUp className="w-3 h-3 text-gray-400 ml-1 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              {isMuted ? 'Unmute' : 'Mute'}
            </span>
          </button>

          {/* 2. Video Button */}
          <button
            id="toggle-video"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-center h-5">
              {isVideoOn ? (
                <Video className="w-[22px] h-[22px] text-white stroke-[2]" />
              ) : (
                /* Custom VideoOff: White camera outline with red slash */
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white relative">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  <line x1="2" x2="22" y1="2" y2="22" stroke="#FF3B30" strokeWidth="2.5" />
                </svg>
              )}
              <ChevronUp className="w-3 h-3 text-gray-400 ml-1 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              Video
            </span>
          </button>
        </div>

        {/* Center Controls (Action Row) */}
        <div className="flex items-center gap-1 justify-center flex-1">
          {/* 3. Participants Button */}
          <div className="relative">
            <button
              id="toggle-participants"
              onClick={() => setActivePanel(activePanel === 'participants' ? null : 'participants')}
              className="flex flex-col items-center justify-center w-[68px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-center h-5 gap-0.5">
                <Users className="w-[22px] h-[22px] text-white stroke-[2]" />
                <span className="text-[12px] text-gray-300 font-medium select-none ml-0.5">
                  {participants.length}
                </span>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowParticipantsMenu(!showParticipantsMenu);
                  }}
                  className="px-1 hover:bg-white/20 rounded-sm cursor-pointer ml-0.5 flex items-center justify-center"
                >
                  <ChevronUp className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
                Participants
              </span>
            </button>
            
            {/* Participants Context Menu */}
            {showParticipantsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowParticipantsMenu(false)}
                />
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A] rounded-lg shadow-2xl border border-[#2A2A2A] py-1 z-50">
                  <button 
                    onClick={() => {
                      setShowParticipantsMenu(false);
                      setShowInviteModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#E6E6E6] hover:bg-[#0E71EB] hover:text-white transition-colors"
                  >
                    Invite...
                  </button>
                  <button 
                    onClick={() => {
                      setShowParticipantsMenu(false);
                      copyMeetingLink();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#E6E6E6] hover:bg-[#0E71EB] hover:text-white transition-colors"
                  >
                    Copy invite link
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 4. Chat Button */}
          <button
            id="toggle-chat"
            onClick={() => setActivePanel(activePanel === 'chat' ? null : 'chat')}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-center h-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <circle cx="8" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="16" cy="10" r="1" fill="currentColor"></circle>
              </svg>
              <ChevronUp className="w-3 h-3 text-gray-400 ml-1 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              Chat
            </span>
          </button>

          {/* 5. React Button */}
          <button
            id="reactions-btn"
            onClick={() => toast('Reactions are coming soon!', { icon: '😊' })}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center h-5">
              <Heart className="w-[22px] h-[22px] text-white stroke-[2]" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              React
            </span>
          </button>

          {/* 6. Share Button */}
          <button
            id="share-screen"
            onClick={() => toast('Screen sharing requires WebRTC integration', { icon: '🖥️' })}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-center h-5">
              <div className="w-[22px] h-[22px] bg-[#0ea871] rounded-[3px] flex items-center justify-center shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="18 15 12 9 6 15"></polyline>
                  <line x1="12" y1="9" x2="12" y2="21"></line>
                </svg>
              </div>
              <ChevronUp className="w-3 h-3 text-gray-400 ml-1 group-hover:text-white transition-colors" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              Share
            </span>
          </button>

          {/* 7. Host Tools Button */}
          <button
            id="security-btn"
            onClick={() => toast('Security settings are managed by the host.', { icon: '🛡️' })}
            className="flex flex-col items-center justify-center w-[68px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center h-5">
              <Shield className="w-[22px] h-[22px] text-white stroke-[2]" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              Host tools
            </span>
          </button>

          {/* 8. AI Companion Button */}
          <button
            id="ai-companion-btn"
            onClick={() => toast('AI Companion is processing transcript...', { icon: '✨' })}
            className="flex flex-col items-center justify-center w-[78px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center h-5">
              <Sparkles className="w-[22px] h-[22px] text-white stroke-[2]" />
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              AI Companion
            </span>
          </button>

          {/* 9. More Button */}
          <button
            id="more-btn"
            onClick={() => toast('More options panel coming soon!', { icon: '⚙️' })}
            className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-center h-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="8" cy="12" r="1" fill="currentColor"></circle>
                <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
                <circle cx="16" cy="12" r="1" fill="currentColor"></circle>
              </svg>
            </div>
            <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
              More
            </span>
          </button>
        </div>

        {/* Right Controls (End Button) */}
        <div className="flex items-center gap-1.5 w-[22%] justify-end">
          <div className="flex flex-col items-center justify-center pr-2">
            <button
              id="end-meeting"
              onClick={() => setShowEndModal(true)}
              className="flex flex-col items-center justify-center w-[58px] h-[44px] hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
            >
              <div className="w-[22px] h-[22px] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 6.5V15.5L12 20L4 15.5V6.5L12 2Z" fill="#FF3B30" stroke="#FF3B30" strokeWidth="1" strokeLinejoin="round" />
                  <path d="M9 9L15 15M15 9L9 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[11px] text-gray-300 mt-1 select-none font-normal leading-none">
                End
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Invite Modal Overlay */}
      {showInviteModal && meeting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 font-sans">
          <div className="bg-white w-[700px] h-[540px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="pt-8 pb-4 flex flex-col items-center px-8 flex-shrink-0">
              <h2 className="text-[22px] font-bold text-black mb-6 tracking-tight">
                Invite People to join meeting {meeting.meeting_id.replace(/(\d{3})(\d{4})(\d{3})/, '$1 $2 $3')}
              </h2>
              
              {/* Tabs */}
              <div className="flex bg-[#E4E4E5] rounded-[8px] p-0.5 w-[380px] h-9 mb-4">
                <button 
                  onClick={() => setActiveInviteTab('contacts')}
                  className={`flex-1 text-[13px] font-medium rounded-[6px] transition-colors ${activeInviteTab === 'contacts' ? 'bg-white shadow-sm text-black' : 'text-[#4A4A4A] hover:bg-white/50'}`}
                >
                  Contacts
                </button>
                <button 
                  onClick={() => setActiveInviteTab('zoomrooms')}
                  className={`flex-1 text-[13px] font-medium rounded-[6px] transition-colors ${activeInviteTab === 'zoomrooms' ? 'bg-white shadow-sm text-black' : 'text-[#4A4A4A] hover:bg-white/50'}`}
                >
                  Zoom Rooms
                </button>
                <button 
                  onClick={() => setActiveInviteTab('email')}
                  className={`flex-1 text-[13px] font-medium rounded-[6px] transition-colors ${activeInviteTab === 'email' ? 'bg-white shadow-sm text-black' : 'text-[#4A4A4A] hover:bg-white/50'}`}
                >
                  Email
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full mt-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#747487]" />
                <input 
                  type="text"
                  placeholder="Choose from the list or type to search"
                  className="w-full h-11 pl-[42px] pr-4 rounded-[8px] border border-[#CBD5E1] text-[15px] text-black focus:outline-none focus:border-[#0E71EB] focus:ring-1 focus:ring-[#0E71EB] placeholder-gray-400"
                />
              </div>
            </div>

            {/* Empty Main Area */}
            <div className="flex-1 bg-white border-t border-[#F0F2F4] mt-2"></div>

            {/* Modal Footer */}
            <div className="h-[72px] border-t border-[#E5E7EB] px-6 flex items-center justify-between flex-shrink-0 bg-white">
              {/* Left Side */}
              <div className="flex items-center gap-6">
                <button 
                  onClick={copyMeetingLink}
                  className="text-[14px] text-[#1A1A1A] hover:text-[#0E71EB] transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Copy URL
                </button>
                <button 
                  onClick={() => {
                    const inv = `Join Zoom Meeting\n${meeting.invite_link}\n\nMeeting ID: ${meeting.meeting_id}${meeting.passcode ? `\nPasscode: ${meeting.passcode}` : ''}`;
                    navigator.clipboard.writeText(inv);
                    toast.success('Invitation copied');
                  }}
                  className="text-[14px] text-[#1A1A1A] hover:text-[#0E71EB] transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Copy Invitation
                </button>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-5">
                {meeting.passcode && (
                  <div className="text-[13px] text-[#1A1A1A]">
                    Passcode: <span className="font-bold font-mono text-[14px] ml-1">{meeting.passcode}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <button className="bg-[#60A5FA] text-white px-6 h-9 rounded-[8px] text-[14px] font-bold cursor-not-allowed opacity-90 shadow-sm">
                    Invite
                  </button>
                  <button 
                    onClick={() => setShowInviteModal(false)}
                    className="bg-white border border-[#CBD5E1] hover:bg-gray-50 text-[#1A1A1A] px-6 h-9 rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End / Leave Meeting Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 font-sans backdrop-blur-[2px]">
          <div className="bg-white w-[380px] rounded-xl shadow-2xl flex flex-col p-6 animate-in fade-in zoom-in duration-200">
            {isHost ? (
              <>
                <p className="text-[14px] text-gray-500 mb-5 text-center px-4 font-medium leading-relaxed">
                  If you leave, the meeting will continue for other participants. To end it for everyone, click End Meeting for All.
                </p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleEndMeeting}
                    className="w-full py-3 bg-[#FF3B30] hover:bg-[#E0352B] text-white rounded-[8px] font-bold text-[15px] transition-colors"
                  >
                    End Meeting for All
                  </button>
                  <button 
                    onClick={handleLeaveMeeting}
                    className="w-full py-3 bg-[#F2F2F2] hover:bg-[#E5E5E5] text-gray-800 rounded-[8px] font-bold text-[15px] transition-colors"
                  >
                    Leave Meeting
                  </button>
                  <button 
                    onClick={() => setShowEndModal(false)}
                    className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-[8px] font-bold text-[15px] transition-colors mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[16px] text-gray-900 mb-6 text-center font-bold">
                  Do you want to leave this meeting?
                </p>
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleLeaveMeeting}
                    className="w-full py-3 bg-[#FF3B30] hover:bg-[#E0352B] text-white rounded-[8px] font-bold text-[15px] transition-colors"
                  >
                    Leave Meeting
                  </button>
                  <button 
                    onClick={() => setShowEndModal(false)}
                    className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-[8px] font-bold text-[15px] transition-colors mt-2"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
