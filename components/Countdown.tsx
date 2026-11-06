'use client';
import { useState, useEffect } from 'react';

export default function Countdown({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);

  const isUrgent = timeLeft < 60000 && timeLeft > 0;

  return (
    <div className={'text-6xl md:text-7xl font-black font-mono tracking-wider ' + (isUrgent ? 'text-red-300 animate-pulse' : 'text-white')}>
      {h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </div>
  );
}