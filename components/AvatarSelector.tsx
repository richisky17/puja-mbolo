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

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (url: string) => void;
}

export default function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-3">
        🎭 Elige tu avatar
      </label>
      <div className="grid grid-cols-6 gap-2 md:gap-3">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.url)}
            className={
              'relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ' +
              (selectedAvatar === avatar.url
                ? 'border-teal-400 shadow-lg shadow-teal-500/50 scale-110'
                : 'border-white/10 hover:border-white/30')
            }
            title={avatar.emoji}
          >
            <img
              src={avatar.url}
              alt={avatar.emoji}
              className="w-full h-full object-cover bg-white/5"
            />
            {selectedAvatar === avatar.url && (
              <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}