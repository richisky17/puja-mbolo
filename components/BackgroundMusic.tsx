'use client';
import { useState, useRef } from 'react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => console.log('Autoplay bloqueado'));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur rounded-full shadow-xl p-3 flex items-center gap-3 z-40 border border-gray-200">
      <button onClick={togglePlay} className={'w-10 h-10 rounded-full flex items-center justify-center text-xl transition ' + (isPlaying ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600')}>
        {isPlaying ? '🔊' : '🔇'}
      </button>
      <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) audioRef.current.volume = v;
      }} className="w-20 accent-purple-600" />
      <audio ref={audioRef} src="/audio/background-game.mp3" loop preload="auto" />
    </div>
  );
}