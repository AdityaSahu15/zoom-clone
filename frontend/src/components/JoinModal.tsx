'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface JoinModalProps {
  onClose: () => void;
  prefillMeetingId?: string;
  prefillPasscode?: string;
}

export default function JoinModal({ onClose, prefillMeetingId, prefillPasscode }: JoinModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [meetingId, setMeetingId] = useState(prefillMeetingId || '');
  const [passcode, setPasscode] = useState(prefillPasscode || '');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [alwaysBrowser, setAlwaysBrowser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Format meeting ID as user types: "123-456-7890"
  const formatMeetingId = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    const cleanId = meetingId.replace(/\D/g, '');
    if (cleanId.length !== 10) {
      setErrorText('Invalid meeting ID');
      return;
    }
    if (!displayName.trim()) {
      setErrorText('Display name is required');
      return;
    }

    const formattedId = `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6)}`;

    setLoading(true);
    try {
      // Validate meeting exists against backend
      await api.get(`/api/meetings/${formattedId}`);
      // Join meeting
      const res = await api.post(`/api/meetings/${formattedId}/join`, {
        display_name: displayName.trim(),
        passcode: passcode.trim() || undefined,
      });
      onClose();
      router.push(`/meeting/${formattedId}?pid=${res.data.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string }; status?: number } };
      if (error.response?.status === 404) {
        setErrorText('Invalid meeting ID');
      } else if (error.response?.status === 401) {
        setErrorText('Incorrect passcode');
      } else {
        setErrorText(error.response?.data?.detail || 'Failed to join meeting');
      }
    } finally {
      setLoading(false);
    }
  };

  const isFilled = meetingId.trim().length > 0 && displayName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in bg-black/50 select-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[20px] border border-gray-100 shadow-2xl w-full max-w-[480px] overflow-hidden p-12 animate-scale-in text-center">
        {/* Elegant Close Cross */}
        <button
          id="join-modal-close"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Centered Title */}
        <h2 className="text-[28px] font-bold text-[#1A1A1A] mb-10 tracking-tight">
          Join Meeting
        </h2>

        <form onSubmit={handleJoin} className="space-y-6 text-left">
          {/* Meeting ID */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2.5">
              Meeting ID or Personal Link Name
            </label>
            <input
              id="join-meeting-id"
              type="text"
              value={meetingId}
              onChange={(e) => {
                setMeetingId(formatMeetingId(e.target.value));
                setErrorText('');
              }}
              placeholder="Enter Meeting ID or Personal Link Name"
              className="w-full h-12 px-5 border border-[#CBD5E1] rounded-[10px] text-[15px] text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-2 focus:ring-[#0E71EB]/20 transition-all font-sans"
              autoComplete="off"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2.5">
              Your Name
            </label>
            <input
              id="join-display-name"
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setErrorText('');
              }}
              placeholder="Enter your name"
              className="w-full h-12 px-5 border border-[#CBD5E1] rounded-[10px] text-[15px] text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-2 focus:ring-[#0E71EB]/20 transition-all font-sans"
            />
          </div>

          {/* Passcode */}
          <div>
            <label className="block text-[14px] font-medium text-gray-700 mb-2.5">
              Passcode (if required)
            </label>
            <input
              id="join-passcode"
              type="text"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setErrorText('');
              }}
              placeholder="Enter meeting passcode"
              className="w-full h-12 px-5 border border-[#CBD5E1] rounded-[10px] text-[15px] text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:border-[#0E71EB] focus:ring-2 focus:ring-[#0E71EB]/20 transition-all font-sans"
            />
          </div>

          {/* Always Join Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="join-always-browser"
              type="checkbox"
              checked={alwaysBrowser}
              onChange={(e) => setAlwaysBrowser(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#0E71EB] focus:ring-[#0E71EB] cursor-pointer"
            />
            <label
              htmlFor="join-always-browser"
              className="text-[14px] text-gray-700 select-none cursor-pointer"
            >
              Always join from browser
            </label>
          </div>

          {/* Error Message */}
          {errorText && (
            <p className="text-[#FF3B30] text-sm font-medium pt-1">{errorText}</p>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <button
              id="join-submit"
              type="submit"
              disabled={loading || !isFilled}
              className={`w-full h-12 font-semibold rounded-[10px] text-[16px] transition-all flex items-center justify-center cursor-pointer select-none ${
                isFilled
                  ? 'bg-[#0E71EB] text-white hover:bg-[#005BCC] shadow-lg shadow-blue-500/20'
                  : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : (
                'Join'
              )}
            </button>
          </div>
        </form>

        {/* Bottom Room Link */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert('H.323/SIP room systems connections are coming soon.');
          }}
          className="text-[14px] text-[#0E71EB] hover:underline hover:text-[#005BCC] font-medium mt-10 block select-none"
        >
          Join a meeting from an H.323/SIP room system
        </a>
      </div>
    </div>
  );
}
