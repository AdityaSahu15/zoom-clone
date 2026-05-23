'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import JoinModal from '@/components/JoinModal';
import { useRouter } from 'next/navigation';

function JoinPageContent() {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meetingId') || '';
  const pwd = searchParams.get('pwd') || '';
  const removed = searchParams.get('removed') === 'true';
  const ended = searchParams.get('ended') === 'true';
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col items-center justify-center p-4">
      {/* Removed Alert */}
      {removed && (
        <div className="absolute top-24 z-10 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-md shadow-sm">
          You have been removed from the meeting by the host.
        </div>
      )}

      {/* Ended Alert */}
      {ended && (
        <div className="absolute top-24 z-10 bg-blue-100 border border-blue-400 text-blue-700 px-6 py-3 rounded-md shadow-sm">
          host ended the meeting
        </div>
      )}

      {/* Zoom Workplace Branding */}
      <div className="flex items-center justify-center gap-1.5 mb-8 select-none absolute top-12 left-1/2 -translate-x-1/2">
        <span className="text-[#0E71EB] text-4xl font-extrabold tracking-tighter">zoom</span>
        <span className="bg-[#0E71EB] text-white text-[9px] uppercase font-bold tracking-widest px-1 py-0.5 rounded-[3px] mt-2">workplace</span>
      </div>
      <JoinModal
        onClose={() => router.push('/')}
        prefillMeetingId={meetingId}
        prefillPasscode={pwd}
      />
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F6F8]" />}>
      <JoinPageContent />
    </Suspense>
  );
}

