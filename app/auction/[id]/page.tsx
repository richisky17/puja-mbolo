'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Countdown from '@/components/Countdown';
import RankingList from '@/components/RankingList';
import Celebration from '@/components/Celebration';
import BackgroundMusic from '@/components/BackgroundMusic';
import AvatarSelector from '@/components/AvatarSelector';

export default function AuctionPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [form, setForm] = useState({ bidder_name: '', amount: '', avatar_url: '' });
  const [showCelebration, setShowCelebration] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const [message, setMessage] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auctionId) return;

    const loadData = async () => {
      const { data: a } = await supabase.from('auctions').select('*').eq('id', auctionId).single();
      setAuction(a);
      setLoading(false);
      if (a) {
        const { data: b } = await supabase.from('bids').select('*').eq('auction_id', auctionId).order('amount', { ascending: false });
        if (b) {
          setBids(b);
          if (b.length > 0) setHighestBid(b[0].amount);
        }
      }
    };
    loadData();

    const channel = supabase.channel('auction-' + auctionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids', filter: 'auction_id=eq.' + auctionId }, payload => {
        const newBid = payload.new;
        setBids(prev => [newBid, ...prev].sort((a: any, b: any) => b.amount - a.amount));
        setHighestBid(newBid.amount);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  useEffect(() => {
    if (auction && auction.end_time && auction.end_time <= Date.now() && !showCelebration) {
      setShowCelebration(true);
    }
  }, [auction, showCelebration]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.avatar_url) { setMessage('Por favor selecciona un avatar'); return; }
    const amount = parseInt(form.amount);
    if (amount <= highestBid) { setMessage('Tu puja debe ser mayor a ' + highestBid + ' XAF'); return; }

    const { error } = await supabase.from('bids').insert({
      auction_id: auctionId,
      bidder_name: form.bidder_name,
      amount: amount,
      avatar_url: form.avatar_url
    });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setForm({ ...form, amount: '' });
      setBidSuccess(true);
      setMessage('¡Puja registrada con éxito! 🎉');
      setTimeout(() => { setMessage(''); setBidSuccess(false); }, 3000);
    }
  };

  const scrollToForm = () => {
    document.getElementById('bid-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-5xl animate-bounce">⏳</div>
      </div>
    );
  }

  if (!auction || (!auction.is_active && auction.end_time > Date.now())) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-7xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-3">Puja no disponible</h1>
          <p className="text-white/50 mb-6">Esta puja aún no está activa.</p>
          <a href="/" className="inline-block px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl">← Volver al inicio</a>
        </div>
      </div>
    );
  }

  const isFinished = auction.end_time <= Date.now();
  const leader = bids.length > 0 ? bids[0] : null;

  return (
    <div className="min-h-screen bg-black pb-28 md:pb-12">
      <BackgroundMusic />
      {showCelebration && <Celebration bids={bids} />}

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Barra superior */}
        <div className="flex items-center justify-between mb-4">
          <a href="/" className="text-white/60 hover:text-teal-400 text-sm">← Inicio</a>
          {!isFinished && auction.is_active && (
            <button onClick={() => router.push('/auction/' + auctionId + '/presentation')} className="text-teal-300 text-sm font-semibold hover:text-teal-200">
              🎬 Presentación
            </button>
          )}
        </div>

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-6">
          {auction.image_url && <img src={auction.image_url} alt={auction.title} className="w-full h-56 md:h-72 object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 p-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{auction.title}</h1>
            <p className="text-white/70 text-sm mt-1 line-clamp-2">{auction.description}</p>
          </div>
        </div>

        {/* Countdown + líder */}
        {!isFinished && auction.is_active ? (
          <div className="text-center mb-8">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Cierra en</p>
            <Countdown endTime={auction.end_time} />
            {leader && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {leader.avatar_url ? (
                  <img src={leader.avatar_url} className="w-8 h-8 rounded-full border border-teal-400/50" alt={leader.bidder_name} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-500 grid place-items-center text-white text-sm font-bold">{leader.bidder_name.charAt(0)}</div>
                )}
                <span className="text-white/60 text-sm">Lidera</span>
                <span className="text-teal-300 font-bold tabular-nums">{leader.amount.toLocaleString()} XAF</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">🏆</div>
            <p className="font-bold text-teal-400 text-xl">¡Puja finalizada!</p>
          </div>
        )}

        {/* Formulario */}
        {!isFinished && auction.is_active && (
          <form id="bid-form" onSubmit={handleBid} className="mb-10 scroll-mt-4">
            <h2 className="font-bold text-lg text-white mb-4">Haz tu puja</h2>
            {message && (
              <div className={'mb-4 px-4 py-3 rounded-xl text-sm font-semibold ' + (bidSuccess ? 'bg-teal-500/15 border border-teal-400/40 text-teal-200' : 'bg-red-500/15 border border-red-400/40 text-red-200')}>
                {message}
              </div>
            )}
            <div className="space-y-4">
              <input
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500 text-base"
                placeholder="Tu nombre"
                value={form.bidder_name}
                onChange={e => setForm({...form, bidder_name: e.target.value})}
                required
              />
              <input
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-teal-500 text-lg font-bold tabular-nums"
                type="number"
                placeholder={'Monto en XAF (mín. ' + (highestBid + 1) + ')'}
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                required
                min={highestBid + 1}
                inputMode="numeric"
              />
              <AvatarSelector selectedAvatar={form.avatar_url} onSelect={(url) => setForm({...form, avatar_url: url})} />
              <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-teal-500/25">
                🚀 ¡PUJAR AHORA!
              </button>
            </div>
          </form>
        )}

        {/* Ranking */}
        <RankingList bids={bids} />
      </div>

      {/* Barra fija móvil */}
      {!isFinished && auction.is_active && (
        <div className="fixed bottom-0 inset-x-0 md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center gap-3 z-40">
          <div className="flex-1">
            <p className="text-white/50 text-[10px] uppercase tracking-wide">Tiempo</p>
            <Countdown endTime={auction.end_time} compact />
          </div>
          <div className="flex-1 text-right">
            <p className="text-white/50 text-[10px] uppercase tracking-wide">Puja alta</p>
            <p className="text-teal-300 font-bold tabular-nums text-sm">{highestBid.toLocaleString()} XAF</p>
          </div>
          <button onClick={scrollToForm} className="bg-teal-500 text-white font-bold px-5 py-3 rounded-xl active:scale-95">
            Pujar
          </button>
        </div>
      )}
    </div>
  );
}