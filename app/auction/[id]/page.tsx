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
  const [hasBid, setHasBid] = useState(false);

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
    if (!auction?.is_active) {
      setMessage('Esta puja no está activa');
      return;
    }
    if (!form.avatar_url) {
      setMessage('Por favor selecciona un avatar');
      return;
    }

    const amount = parseInt(form.amount);
    if (amount <= highestBid) {
      setMessage('Tu puja debe ser mayor a ' + highestBid + ' XAF');
      return;
    }

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
      setHasBid(true);
      setMessage('¡Puja registrada con éxito! 🎉');
      setTimeout(() => { setMessage(''); setBidSuccess(false); }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-white text-xl">Cargando puja...</p>
        </div>
      </div>
    );
  }

  if (!auction || (!auction.is_active && auction.end_time > Date.now())) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20"></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="text-8xl mb-6">🔒</div>
          <h1 className="text-4xl font-bold text-white mb-4">Puja no disponible</h1>
          <p className="text-white/60 text-lg mb-8">
            Esta puja aún no está activa o no existe. 
            Solo puedes ver las pujas que el administrador ha activado.
          </p>
          <a href="/" className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all">
            ← Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const isFinished = auction.end_time <= Date.now();

  return (
    <div className="min-h-screen bg-black pb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <BackgroundMusic />
      {showCelebration && <Celebration bids={bids} />}
      
      <div className="relative z-10 container mx-auto p-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-teal-400 transition-colors">
            ← Inicio
          </a>
          {auction.is_active && !isFinished && (
            <button 
              onClick={() => router.push('/auction/' + auctionId + '/presentation')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-400/50 text-teal-300 rounded-lg hover:bg-teal-500/30 transition-all text-sm font-semibold"
            >
              🎬 Ver Presentación
            </button>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {auction.image_url && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img src={auction.image_url} alt={auction.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{auction.title}</h1>
              </div>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <p className="text-white/70 text-lg mb-6">{auction.description}</p>

            {!isFinished && auction.is_active ? (
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-2xl mb-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                <div className="relative">
                  <h2 className="text-lg font-semibold text-white/90 mb-2">⏰ La puja cierra en:</h2>
                  <Countdown endTime={auction.end_time} />
                  <div className="mt-3 text-white/90 text-sm">
                    💰 Puja actual: <span className="font-bold text-white">{highestBid.toLocaleString()} XAF</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-teal-500/10 border-2 border-teal-400/30 p-6 mb-6 rounded-2xl text-center">
                <div className="text-5xl mb-2">🏆</div>
                <p className="font-bold text-teal-400 text-2xl">¡La puja ha terminado!</p>
              </div>
            )}

            {!isFinished && auction.is_active && (
              <form onSubmit={handleBid} className={'bg-white/5 backdrop-blur p-6 rounded-2xl mb-6 border-2 ' + (bidSuccess ? 'border-teal-400/50' : 'border-white/10')}>
                <h3 className="font-bold text-2xl mb-4 text-white flex items-center gap-2">
                  💰 Realizar una Puja
                </h3>
                {message && (
                  <div className={'mb-4 px-4 py-3 rounded-xl font-semibold ' + (bidSuccess ? 'bg-teal-500/20 border border-teal-400/50 text-teal-200' : 'bg-red-500/20 border border-red-400/50 text-red-200')}>
                    {message}
                  </div>
                )}
                <div className="space-y-4">
                  <input 
                    className="w-full p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors text-lg" 
                    placeholder="👤 Tu nombre" 
                    value={form.bidder_name} 
                    onChange={e => setForm({...form, bidder_name: e.target.value})} 
                    required 
                  />
                  <input 
                    className="w-full p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors text-lg font-bold" 
                    type="number" 
                    placeholder={'💵 Monto en XAF (Mín: ' + (highestBid + 1) + ')'} 
                    value={form.amount} 
                    onChange={e => setForm({...form, amount: e.target.value})} 
                    required 
                    min={highestBid + 1} 
                  />
                  
                  <AvatarSelector 
                    selectedAvatar={form.avatar_url} 
                    onSelect={(url) => setForm({...form, avatar_url: url})} 
                  />
                  
                  {form.avatar_url && (
                    <div className="flex items-center gap-3 p-3 bg-teal-500/10 border border-teal-400/30 rounded-xl">
                      <img src={form.avatar_url} alt="Avatar seleccionado" className="w-12 h-12 rounded-full bg-white/10" />
                      <div>
                        <p className="text-white/60 text-xs">Avatar seleccionado</p>
                        <p className="text-teal-400 font-semibold text-sm">✓ Listo para pujar</p>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-5 rounded-xl font-bold text-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-teal-500/25 active:scale-95"
                  >
                    🚀 ¡PUJAR AHORA!
                  </button>

                  {hasBid && (
                    <button 
                      type="button"
                      onClick={() => router.push('/auction/' + auctionId + '/presentation')}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      🎬 Ver Presentación en Vivo
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <RankingList bids={bids} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}