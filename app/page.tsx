'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AuctionCard from '@/components/AuctionCard';
import Logo from '@/components/Logo';

export default function Home() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const load = async () => {
    const { data } = await supabase
      .from('auctions')
      .select('*')
      .eq('is_active', true)
      .order('end_time', { ascending: true });
    if (data) {
      setAuctions(data);
      const entries: any = {};
      await Promise.all(data.map(async (a: any) => {
        const { data: b } = await supabase.from('bids').select('amount').eq('auction_id', a.id).order('amount', { ascending: false });
        entries[a.id] = { highest: b && b.length > 0 ? b[0].amount : 0, count: b ? b.length : 0 };
      }));
      setStats(entries);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase.channel('portal')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, () => load())
      .subscribe();
    const refresh = setInterval(load, 10000);
    const tick = setInterval(() => setNow(Date.now()), 5000);
    return () => { supabase.removeChannel(channel); clearInterval(refresh); clearInterval(tick); };
  }, []);

  const active = auctions.filter(a => a.end_time > now);

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header con Logo oficial y navegación */}
      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Logo size="default" showLink={true} />
          <div className="flex items-center gap-4">
            <a 
              href="https://www.mboloeg.com/" 
              target="_blank" 
              className="text-white/60 hover:text-teal-400 text-sm font-medium transition-colors flex items-center gap-2"
            >
               Web oficial ↗
            </a>
            <a 
              href="/admin/login" 
              className="text-white/40 hover:text-white text-sm font-medium transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 flex-1">
        {/* Hero section con llamado a la acción */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Pujas activas</h1>
              <p className="text-white/50 text-base">Elige una subasta y entra a la sala en vivo</p>
            </div>
            <span className="text-xs bg-teal-500/15 text-teal-300 px-4 py-2 rounded-full border border-teal-400/30 animate-pulse shrink-0 font-semibold">
              ● EN VIVO
            </span>
          </div>

          {/* Botón destacado para volver a Mbôlo */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 rounded-2xl p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">¿Quieres explorar más?</h3>
                <p className="text-white/60 text-sm">Visita la plataforma oficial Mbôlo para aprender lenguas vernáculas</p>
              </div>
              <a 
                href="https://www.mboloeg.com/" 
                target="_blank"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
              >
                Ir a Mbôloeg.com ↗
              </a>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-72 rounded-3xl bg-white/5 animate-pulse"></div>)}
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-white mb-2">No hay pujas activas</h2>
            <p className="text-white/50 mb-6">Vuelve pronto, ¡se están preparando nuevas subastas!</p>
            <a 
              href="https://www.mboloeg.com/" 
              target="_blank" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all"
            >
              Visitar Mbôloeg.com ↗
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(a => (
              <AuctionCard
                key={a.id}
                auction={a}
                highestBid={(stats[a.id] || {}).highest || 0}
                bidCount={(stats[a.id] || {}).count || 0}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="relative max-w-5xl mx-auto px-4 py-8 text-center border-t border-white/5 mt-8">
        <p className="text-white/30 text-sm mb-2">
          Plataforma de pujas oficial de <a href="https://www.mboloeg.com/" target="_blank" className="text-emerald-400 hover:underline font-semibold">Mbôlo</a>
        </p>
        <p className="text-white/20 text-xs">💰 Pujas en XAF · Hecho en Guinea Ecuatorial 🇶</p>
      </footer>
    </div>
  );
}