'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import Celebration from '@/components/Celebration';
import RankingList from '@/components/RankingList';

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
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-white text-xl">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!auction || !auction.is_active) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold text-white mb-4">Presentación no disponible</h1>
          <p className="text-white/60 text-lg mb-8">
            Esta puja no está activa.
          </p>
          <button onClick={() => router.push('/')} className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? bids[0].amount : 0;
  const isFinished = auction.end_time <= Date.now();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      {showCelebration && <Celebration bids={bids} />}

      <div className="relative z-10 container mx-auto p-4 md:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <a href={'/auction/' + auctionId} className="inline-flex items-center gap-2 text-white/70 hover:text-teal-400 transition-colors">
              ← Volver a la puja
            </a>
            <div className="px-4 py-2 bg-teal-500/20 border border-teal-400/50 rounded-full text-teal-300 text-sm font-semibold animate-pulse">
              ● MODO PRESENTACIÓN
            </div>
          </div>
          
          {auction.image_url && (
            <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-4">
              <img src={auction.image_url} alt={auction.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{auction.title}</h1>
              </div>
            </div>
          )}
          
          <p className="text-white/70 text-lg">{auction.description}</p>
        </div>

        {/* Cuenta atrás y stats */}
        {!isFinished ? (
          <div className="bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-400/30 rounded-2xl p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-white/90 mb-2">⏰ La puja cierra en:</h2>
              <Countdown endTime={auction.end_time} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Puja más alta</p>
                <p className="text-3xl font-bold text-teal-400">{highestBid.toLocaleString()} XAF</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-1">Total de pujas</p>
                <p className="text-3xl font-bold text-white">{bids.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-teal-500/10 border-2 border-teal-400/30 p-6 mb-8 rounded-2xl text-center">
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-bold text-teal-400 text-2xl">¡La puja ha terminado!</p>
          </div>
        )}

        {/* Ranking */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 mb-8">
          <RankingList bids={bids} />
        </div>

        {/* Botón para pujar */}
        {!isFinished && (
          <div className="text-center">
            <button 
              onClick={() => router.push('/auction/' + auctionId)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              💰 ¡QUIERO PUJAR!
            </button>
            <p className="text-white/40 text-sm mt-3">Haz clic para enviar tu oferta</p>
          </div>
        )}
      </div>
    </div>
  );
}