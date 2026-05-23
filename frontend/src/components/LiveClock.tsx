'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

// Isolated clock component — only THIS re-renders every second, not the whole dashboard
export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client only (avoids hydration mismatch)
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) {
    return (
      <div className="animate-pulse">
        <div className="h-12 w-48 bg-white/10 rounded mb-2" />
        <div className="h-4 w-36 bg-white/10 rounded" />
      </div>
    );
  }

  return (
    <div className="select-none">
      <p className="text-5xl font-semibold tracking-tight text-white tabular-nums">
        {format(currentTime, 'h:mm')}
        <span className="text-xl font-normal ml-1.5 uppercase text-white/85">
          {format(currentTime, 'a')}
        </span>
      </p>
      <p className="text-xs font-medium text-white/70 mt-2 tracking-wide font-sans">
        {format(currentTime, 'EEEE, MMMM d, yyyy')}
      </p>
    </div>
  );
}
