'use client';
import { useEffect, useState } from 'react';

export default function Celebration({ bids }: { bids: any[] }) {
  const [particles, setParticles] = useState<any[]>([]);
  const winner = bids && bids.length > 0 ? bids[0] : null;
  const lastTwo = bids.length >= 3 ? bids.slice(-2) : [];

  useEffect(() => {
    const newParticles = Array.from({ length: 150 }, (_, i) => ({
      id: i, x: Math.random() * 100, color: 'hsl(' + (Math.random() * 360) + ', 100%, 50%)',
      size: Math.random() * 12 + 5, duration: Math.random() * 3 + 2, delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden bg-black/80 backdrop-blur-md">
      {particles.map(p => (
        <div key={p.id} className="absolute animate-fall" style={{
          left: p.x + '%', top: '-5%', width: p.size + 'px', height: p.size + 'px',
          backgroundColor: p.color, animationDuration: p.duration + 's', animationDelay: p.delay + 's'
        }} />
      ))}
      
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="text-center bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur-xl border-2 border-teal-400/50 rounded-3xl p-8 md:p-12 shadow-2xl max-w-4xl w-full my-8">
          <div className="text-7xl md:text-8xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-lg">
            ¡PUJA CERRADA!
          </h1>
          
          {winner ? (
            <div className="space-y-8">
              {/* Ganador */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl p-6 md:p-8">
                <p className="text-yellow-300 text-xl mb-4 font-bold">🎉 GANADOR 🎉</p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  {winner.avatar_url ? (
                    <img src={winner.avatar_url} alt={winner.bidder_name} className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-2xl" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-4xl border-4 border-yellow-400 shadow-2xl">
                      {winner.bidder_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
                  {winner.bidder_name}
                </h2>
                <p className="text-3xl md:text-4xl font-bold text-yellow-400">
                  {winner.amount.toLocaleString()} XAF
                </p>
              </div>

              {/* Últimos 2 lugares */}
              {lastTwo.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lastTwo.map((bid, idx) => (
                    <div key={bid.id} className="bg-white/5 border border-white/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        {bid.avatar_url ? (
                          <img src={bid.avatar_url} alt={bid.bidder_name} className="w-12 h-12 rounded-full border-2 border-white/30" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold border-2 border-white/30">
                            {bid.bidder_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-white/60 text-sm">Posición #{bids.indexOf(bid) + 1}</p>
                          <p className="text-white font-semibold">{bid.bidder_name}</p>
                        </div>
                      </div>
                      <p className="text-teal-400 font-bold text-lg">{bid.amount.toLocaleString()} XAF</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white/60 text-xl mt-4">No hubo pujas en esta subasta</p>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-white animate-flash opacity-0" />
      <audio autoPlay loop src="/audio/celebration.mp3" />

      <style>{`
        @keyframes fall { to { transform: translateY(110vh) rotate(720deg); } }
        .animate-fall { animation: fall linear infinite; }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 0.4; } }
        .animate-flash { animation: flash 0.3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}