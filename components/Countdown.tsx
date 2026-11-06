'use client';
import { useState, useEffect } from 'react';

export default function Countdown({ endTime, compact = false }: { endTime: number; compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(Math.max(0, endTime - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const urgent = timeLeft < 60000 && timeLeft > 0;
  const text = h > 0
    ? h + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0')
    : m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');

  if (compact) {
    return <span className={'font-mono font-bold tabular-nums ' + (urgent ? 'text-red-400 animate-pulse' : 'text-teal-300')}>{text}</span>;
  }

  return (
    <div className={'font-mono font-black tabular-nums tracking-tight leading-none ' + (urgent ? 'text-red-400 animate-pulse' : 'text-white') + ' text-6xl md:text-7xl'}>
      {text}
    </div>
  );
}