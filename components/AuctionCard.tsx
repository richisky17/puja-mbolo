'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AuctionCard({ auction, highestBid, bidCount }: { auction: any; highestBid: number; bidCount: number }) {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, auction.end_time - Date.now()));

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(Math.max(0, auction.end_time - Date.now())), 1000);
    return () => clearInterval(t);
  }, [auction.end_time]);

  const m = Math.floor(timeLeft / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const urgent = timeLeft < 60000;

  return (
    <Link
      href={'/auction/' + auction.id + '/presentation'}
      className="group block bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-teal-400/50 transition-all active:scale-[0.98]"
    >
      <div className="relative h-44 overflow-hidden">
        <img src={auction.image_url} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <span className={'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold tabular-nums ' + (urgent ? 'bg-red-500/90 text-white animate-pulse' : 'bg-black/60 text-teal-300 backdrop-blur')}>
          ⏱ {m}:{s.toString().padStart(2, '0')}
        </span>
        {bidCount > 0 && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur">
            {bidCount} pujas
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white text-lg truncate">{auction.title}</h3>
        <div className="flex items-end justify-between mt-2">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-white/40">Puja actual</p>
            <p className="text-teal-300 font-bold tabular-nums">{highestBid.toLocaleString()} XAF</p>
          </div>
          <span className="text-teal-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">Entrar →</span>
        </div>
      </div>
    </Link>
  );
}