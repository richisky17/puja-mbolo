export default function Podium({ bids }: { bids: any[] }) {
  const top = bids.slice(0, 3);
  if (top.length === 0) return null;

  const cfg: any = {
    1: { bar: 'h-24 md:h-32 bg-gradient-to-t from-teal-500/70 to-teal-400/20', avatar: 'w-20 h-20 md:w-24 md:h-24', medal: '👑', ring: 'border-yellow-400' },
    2: { bar: 'h-16 md:h-20 bg-gradient-to-t from-white/25 to-white/5', avatar: 'w-14 h-14 md:w-16 md:h-16', medal: '🥈', ring: 'border-white/40' },
    3: { bar: 'h-10 md:h-14 bg-gradient-to-t from-orange-500/50 to-orange-400/15', avatar: 'w-14 h-14 md:w-16 md:h-16', medal: '🥉', ring: 'border-orange-400/60' },
  };

  const order = [
    { bid: top[1], rank: 2 },
    { bid: top[0], rank: 1 },
    { bid: top[2], rank: 3 },
  ];

  return (
    <div className="flex items-end gap-3 md:gap-6">
      {order.map(({ bid, rank }) => (
        <div key={rank} className="flex-1 flex flex-col items-center gap-2 min-w-0">
          {bid ? (
            <>
              <span className="text-2xl">{cfg[rank].medal}</span>
              {bid.avatar_url ? (
                <img src={bid.avatar_url} alt={bid.bidder_name} className={cfg[rank].avatar + ' rounded-full border-2 ' + cfg[rank].ring + ' shadow-lg'} />
              ) : (
                <div className={cfg[rank].avatar + ' rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 grid place-items-center text-white font-bold border-2 ' + cfg[rank].ring}>
                  {bid.bidder_name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-white font-semibold text-sm truncate w-full text-center">{bid.bidder_name}</p>
              <p className={'font-bold tabular-nums ' + (rank === 1 ? 'text-yellow-300 text-lg' : 'text-teal-300 text-sm')}>
                {bid.amount.toLocaleString()}
              </p>
              <div className={'w-full rounded-t-xl ' + cfg[rank].bar}></div>
            </>
          ) : (
            <div className="w-full"></div>
          )}
        </div>
      ))}
    </div>
  );
}