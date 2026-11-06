'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import Celebration from '@/components/Celebration';
import RankingList from '@/components/RankingList';
import Podium from '@/components/Podium';
import Logo from '@/components/Logo';

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!auctionId) return;

    const loadData = async () => {
      const { data: a } = await supabase.from('auctions').select('*').eq('id', auctionId).single();
      setAuction(a);
      setLoading(false);
      if (a) {
        const { data: b } = await supabase.from('bids').select('*').eq('auction_id', auctionId).order('amount', { ascending: false });
        if (b) setBids(b);
      }
    };
    loadData();

    const channel = supabase.channel('auction-' + auctionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: 'auction_id=eq.' + auctionId }, payload => {
        const newBid = payload.new;
        setBids(prev => [newBid, ...prev].sort((a: any, b: any) => b.amount - a.amount));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  useEffect(() => {
    if (auction && auction.end_time && auction.end_time <= Date.now() && !showCelebration) {
      setShowCelebration(true);
    }
  }, [auction, showCelebration]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-5xl animate-bounce">⏳</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-7xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-3">No disponible</h1>
          <button onClick={() => router.push('/')} className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl">← Ver pujas activas</button>
        </div>
      </div>
    );
  }

  const isFinished = auction.end_time <= Date.now();
  const highestBid = bids.length > 0 ? bids[0].amount : 0;
  const rest = bids.slice(3);

  return (
    <div className="min-h-screen bg-black pb-28 md:pb-12">
      {showCelebration && <Celebration bids={bids} />}

      <div className="max-w-3xl mx-auto px-4 pt-4">
        {/* Barra superior con Logo y navegación clara */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <a href="/" className="text-white/60 hover:text-teal-400 text-sm font-medium transition-colors">← Portal</a>
            <div className="w-px h-4 bg-white/20 hidden sm:block"></div>
            <a href="https://www.mboloeg.com/" target="_blank" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors flex items-center gap-1">
              Mbôloeg.com ↗
            </a>
          </div>
          <span className="text-xs bg-teal-500/15 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30 animate-pulse font-semibold">● EN VIVO</span>
        </div>

        {/* Hero compacto */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          {auction.image_url && <img src={auction.image_url} alt={auction.title} className="w-full h-40 md:h-56 object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 p-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{auction.title}</h1>
          </div>
        </div>

        {/* Countdown gigante */}
        {!isFinished ? (
          <div className="text-center mb-6">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Cierra en</p>
            <Countdown endTime={auction.end_time} />
          </div>
        ) : (
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-bold text-teal-400 text-2xl">¡Puja finalizada!</p>
          </div>
        )}

        {/* Stats inline */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70">
            💰 Alta: <span className="text-teal-300 font-bold tabular-nums">{highestBid.toLocaleString()} XAF</span>
          </span>
          <span className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/70">
            🎯 <span className="text-white font-bold">{bids.length}</span> pujas
          </span>
        </div>

        {/* Podio */}
        {bids.length > 0 && (
          <div className="mb-10">
            <Podium bids={bids} />
          </div>
        )}

        {/* Resto del ranking */}
        {rest.length > 0 && (
          <div className="mb-10">
            <RankingList bids={rest} startRank={4} />
          </div>
        )}

        {bids.length === 0 && (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🎮</div>
            <p className="text-white/50">Esperando las primeras pujas...</p>
          </div>
        )}

        {/* CTA desktop */}
        {!isFinished && (
          <div className="hidden md:flex justify-center gap-3 mt-8">
            <button onClick={() => router.push('/auction/' + auctionId)} className="px-10 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-teal-500/25 transition-all hover:scale-105">
              💰 ¡QUIERO PUJAR!
            </button>
            <button onClick={() => router.push('/')} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-2xl transition-all">
              ← Otras pujas
            </button>
          </div>
        )}
      </div>

      {/* CTA fijo móvil */}
      {!isFinished && (
        <div className="fixed bottom-0 inset-x-0 md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 z-40">
          <button onClick={() => router.push('/auction/' + auctionId)} className="w-full bg-teal-500 active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-teal-500/25">
            💰 ¡QUIERO PUJAR!
          </button>
        </div>
      )}
    </div>
  );
}