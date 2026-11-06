export default function RankingList({ bids }: { bids: any[] }) {
  if (bids.length === 0) return (
    <div className="text-center py-8">
      <div className="text-6xl mb-3">🎮</div>
      <p className="text-white/60 text-lg">Aún no hay pujas</p>
      <p className="text-white/40 text-sm mt-1">¡Sé el primero en participar!</p>
    </div>
  );

  return (
    <div>
      <h3 className="font-bold text-2xl mb-4 text-white flex items-center gap-2">
        🏆 Ranking en Vivo
        <span className="ml-auto text-sm bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-400/50 animate-pulse">
          ● EN VIVO
        </span>
      </h3>
      <div className="space-y-3">
        {bids.map((bid, index) => (
          <div key={bid.id} className={"flex items-center justify-between p-4 rounded-xl border-2 transition-all " + (
            index === 0 ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-lg shadow-yellow-500/20 scale-[1.02]" :
            index === 1 ? "bg-white/10 border-gray-300/50" :
            index === 2 ? "bg-orange-500/10 border-orange-400/50" :
            "bg-white/5 border-white/10 hover:bg-white/10"
          )}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "#" + (index + 1)}</span>
              {bid.avatar_url ? (
                <img src={bid.avatar_url} alt={bid.bidder_name} className="w-12 h-12 rounded-full object-cover bg-white/10 border-2 border-white/30" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                  {bid.bidder_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="font-bold text-white text-lg">{bid.bidder_name}</span>
                {index === 0 && <span className="ml-2 text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">LÍDER</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-teal-400">{bid.amount.toLocaleString()}</div>
              <div className="text-xs text-white/60">XAF</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}