'use client';

const AVATARS = [
  { id: 'lion', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lion&backgroundColor=ff6b6b', emoji: '🦁' },
  { id: 'tiger', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tiger&backgroundColor=feca57', emoji: '🐯' },
  { id: 'fox', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fox&backgroundColor=ff9ff3', emoji: '🦊' },
  { id: 'panda', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Panda&backgroundColor=c8d6e5', emoji: '🐼' },
  { id: 'koala', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Koala&backgroundColor=8395a7', emoji: '🐨' },
  { id: 'unicorn', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unicorn&backgroundColor=a29bfe', emoji: '🦄' },
  { id: 'dragon', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dragon&backgroundColor=55efc4', emoji: '🐉' },
  { id: 'eagle', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eagle&backgroundColor=74b9ff', emoji: '🦅' },
  { id: 'wolf', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wolf&backgroundColor=636e72', emoji: '🐺' },
  { id: 'monkey', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Monkey&backgroundColor=fdcb6e', emoji: '🐵' },
  { id: 'rabbit', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rabbit&backgroundColor=fd79a8', emoji: '🐰' },
  { id: 'bear', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear&backgroundColor=e17055', emoji: '🐻' },
];

export default function AvatarSelector({ selectedAvatar, onSelect }: { selectedAvatar: string; onSelect: (url: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-white/80 text-sm font-semibold">Elige tu avatar</label>
        <span className="text-white/40 text-xs md:hidden">Desliza →</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-6 md:overflow-visible">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.url)}
            aria-label={'Avatar ' + avatar.emoji}
            className={
              'relative shrink-0 snap-start w-16 h-16 md:w-full md:aspect-square rounded-2xl overflow-hidden border-2 transition-all active:scale-90 ' +
              (selectedAvatar === avatar.url
                ? 'border-teal-400 ring-4 ring-teal-400/30'
                : 'border-white/10 hover:border-white/40')
            }
          >
            <img src={avatar.url} alt={avatar.emoji} className="w-full h-full object-cover" />
            {selectedAvatar === avatar.url && (
              <span className="absolute inset-0 grid place-items-center bg-teal-500/40 text-white text-2xl font-bold">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}