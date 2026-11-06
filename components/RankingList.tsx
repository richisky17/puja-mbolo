export default function RankingList({ bids, startRank = 1 }: { bids: any[]; startRank?: number }) {
  if (!bids || bids.length === 0) return (
    <div className="text-center py-10">
      <div className="text-5xl mb-3">🎮</div>
      <p className="text-white/50">Aún no hay pujas. ¡Sé el primero!</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-white">Ranking en vivo</h3>
        <span className="text-xs bg-teal-500/15 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30 animate-pulse">● EN VIVO</span>
      </div>
      <div className="divide-y divide-white/5">
        {bids.map((bid, index) => {
          const rank = startRank + index;
          return (
            <div key={bid.id} className={'flex items-center gap-3 py-3 ' + (rank === 1 ? '-mx-3 px-3 rounded-xl bg-teal-500/10' : '')}>
              <span className="w-8 text-center text-xl shrink-0">
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : <span className="text-white/40 text-sm font-mono">#{rank}</span>}
              </span>
              {bid.avatar_url ? (
                <img src={bid.avatar_url} alt={bid.bidder_name} className="w-11 h-11 rounded-full border border-white/20 shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 grid place-items-center text-white font-bold shrink-0">
                  {bid.bidder_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {bid.bidder_name}
                  {rank === 1 && <span className="ml-2 text-[10px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full align-middle">LÍDER</span>}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-teal-300 tabular-nums">{bid.amount.toLocaleString()}</p>
                <p className="text-[10px] text-white/40">XAF</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}