'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Puja123!') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-teal-950/20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🎯</span>
            <span className="text-3xl font-bold text-white">
              Puja <span className="text-teal-400">Mbôlo</span>
            </span>
          </div>
          <p className="text-white/60">Acceso al panel de administración</p>
        </div>

        {/* Formulario */}
        <form className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🔑</div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-teal-500/25"
            >
              Ingresar
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-white/40 hover:text-teal-400 text-sm transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}