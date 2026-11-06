import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gradiente de fondo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/50 via-black to-teal-950/30"></div>
      
      {/* Efecto de brillo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      {/* Navegación */}
      <nav className="relative z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <span className="text-2xl font-bold text-white">
              Puja <span className="text-teal-400">Mbôlo</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white/70 hover:text-teal-400 transition-colors">Región</a>
            <a href="#" className="text-white/70 hover:text-teal-400 transition-colors">Acerca de</a>
            <a href="#" className="text-white/70 hover:text-teal-400 transition-colors">Contacto</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 border border-white/20 rounded-lg text-white/70 text-sm">
              🌍 ES
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 w-fit">
          <span className="text-teal-400">⭐</span>
          <span className="text-white/80 text-sm">Hecho en Guinea Ecuatorial 🇬🇶</span>
        </div>

        {/* Título principal */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            El juego de pujas <br/>
            <span className="text-teal-400">más emocionante</span>
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl">
            Puja en tiempo real, compite con otros usuarios y gana productos increíbles. 
            La plataforma moderna de subastas en XAF.
          </p>
          
          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/admin" className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-teal-500/25">
              🎮 Ver Pujas Activas
            </Link>
            <Link href="/admin/login" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold rounded-xl transition-all">
              🔐 Panel Admin
            </Link>
          </div>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex -space-x-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 border-2 border-black flex items-center justify-center text-xs font-bold text-white">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            Únete a miles de personas que están pujando y ganando.
          </p>
        </div>

        {/* Características */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Tiempo Real</h3>
            <p className="text-white/60">Las pujas se actualizan al instante para todos los participantes</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ranking en Vivo</h3>
            <p className="text-white/60">Mira quién va ganando y supera sus ofertas</p>
          </div>
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-xl font-semibold text-white mb-2">Celebración Épica</h3>
            <p className="text-white/60">Fuegos artificiales y música cuando cierra la puja</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p> Pujas en XAF (Franco CFA)</p>
          <p>🌍 Disponible en todo el mundo</p>
        </div>
      </div>
    </div>
  );
}