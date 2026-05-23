'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar, Clock, Users, Copy, ExternalLink,
  Video, ChevronRight, Trash2
} from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Meeting } from '@/lib/types';
import api from '@/lib/api';
import { toast } from 'sonner';

interface MeetingCardProps {
  meeting: Meeting;
  currentUserId?: number;
  onDeleted?: (meetingId: string) => void;
}

export default function MeetingCard({ meeting, currentUserId, onDeleted }: MeetingCardProps) {
  const router = useRouter();
  const [copying, setCopying] = useState(false);

  const isHost = meeting.host_id === currentUserId;
  const isPastMeeting = isPast(new Date(meeting.start_time)) || meeting.status === 'completed';

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-red-100 text-red-700',
  };

  const copyLink = async () => {
    if (!meeting.invite_link) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(meeting.invite_link);
      toast.success('Invite link copied!');
    } catch {
      toast.error('Failed to copy link');
    } finally {
      setTimeout(() => setCopying(false), 1500);
    }
  };

  const handleJoin = async () => {
    try {
      await api.post(`/api/meetings/${meeting.meeting_id}/join`, {
        display_name: 'Me',
      });
      router.push(`/meeting/${meeting.meeting_id}`);
    } catch {
      router.push(`/meeting/${meeting.meeting_id}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Cancel this meeting?')) return;
    try {
      await api.delete(`/api/meetings/${meeting.meeting_id}`);
      toast.success('Meeting cancelled');
      onDeleted?.(meeting.meeting_id);
    } catch {
      toast.error('Failed to cancel meeting');
    }
  };

  return (
    <div className="group py-4 pl-6 pr-2 hover:bg-gray-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Time section */}
        <div className="flex-shrink-0 text-left min-w-[70px]">
          <div className="text-[15px] font-bold text-gray-800 leading-none">
            {format(new Date(meeting.start_time), 'h:mm')}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
            {format(new Date(meeting.start_time), 'a')}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-9 w-[1.5px] bg-gray-200" />

        {/* Meeting details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {meeting.title}
            </h3>
            {meeting.status === 'active' && (
              <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                Live
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1 truncate">
            Meeting ID: <span className="font-mono">{meeting.meeting_id}</span>
            {meeting.host_name && (
              <>
                {' · '}
                Host: <span className="font-medium">{meeting.host_name}</span>
                {isHost && <span className="text-[#0E71EB] font-semibold ml-0.5">(You)</span>}
              </>
            )}
            {' · '}
            {meeting.duration < 60
              ? `${meeting.duration} mins`
              : `${meeting.duration / 60} hrs`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 flex-shrink-0 self-end sm:self-center">
        {!isPastMeeting ? (
          <>
            <button
              id={`meeting-join-${meeting.meeting_id}`}
              onClick={handleJoin}
              className="px-4 py-1.5 bg-[#0E71EB] hover:bg-[#005BCC] text-white text-xs font-bold rounded-lg transition-colors shadow-sm active:scale-[0.98]"
            >
              {isHost ? 'Start' : 'Join'}
            </button>

            <button
              id={`meeting-copy-${meeting.meeting_id}`}
              onClick={copyLink}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                copying
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copying ? 'Copied' : 'Copy Invite'}
            </button>

            {isHost && (
              <button
                id={`meeting-delete-${meeting.meeting_id}`}
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel Meeting"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Ended
            </span>
            <button
              className="flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
