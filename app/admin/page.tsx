'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', image_url: '', duration_seconds: 300 });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') !== 'true') {
      router.push('/admin/login');
    } else {
      loadAuctions();
    }
  }, [router]);

  const loadAuctions = async () => {
    const { data } = await supabase.from('auctions').select('*').order('created_at', { ascending: false });
    if (data) setAuctions(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      setUploadingImage(false);
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      setUploadingImage(false);
      return;
    }

    try {
      // Crear nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('auctions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('auctions')
        .getPublicUrl(fileName);

      setForm({ ...form, image_url: publicUrl });
    } catch (error: any) {
      alert('Error al subir imagen: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const createAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const now = Date.now();
    const startTime = now + 60000;
    const endTime = startTime + (form.duration_seconds * 1000);

    const { data, error } = await supabase.from('auctions').insert({
      ...form,
      start_time: startTime,
      end_time: endTime,
      is_active: false
    }).select();

    setLoading(false);
    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('¡Puja creada! Link: ' + window.location.origin + '/auction/' + data[0].id);
      setForm({ title: '', description: '', image_url: '', duration_seconds: 300 });
      setShowForm(false);
      loadAuctions();
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await supabase.from('auctions').update({ is_active: !currentStatus }).eq('id', id);
    loadAuctions();
  };

  const deleteAuction = async (id: string) => {
    if (confirm('¿Eliminar esta puja permanentemente?')) {
      await supabase.from('auctions').delete().eq('id', id);
      loadAuctions();
    }
  };

  return (
    <div className="min-h-screen bg-black relative p-4 md:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/10"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Panel de <span className="text-teal-400">Administración</span>
            </h1>
            <p className="text-white/60">Gestiona tus pujas en tiempo real</p>
          </div>
          <button onClick={() => { localStorage.removeItem('adminAuth'); router.push('/admin/login'); }} className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all">
            Cerrar Sesión
          </button>
        </div>

        {/* Botón crear */}
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="w-full mb-6 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-lg rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2">
            ✨ Crear Nueva Puja
          </button>
        )}

        {/* Formulario */}
        {showForm && (
          <form onSubmit={createAuction} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl mb-8 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Nueva Puja</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-white/60 hover:text-white text-2xl">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                className="p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-teal-500 focus:outline-none transition-colors" 
                placeholder="Título del producto" 
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
              <input 
                className="p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-teal-500 focus:outline-none transition-colors" 
                type="number" 
                placeholder="Duración en segundos" 
                value={form.duration_seconds} 
                onChange={e => setForm({...form, duration_seconds: parseInt(e.target.value)})} 
                required 
              />
              
              {/* Upload de imagen */}
              <div className="md:col-span-2">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Imagen del producto
                </label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploadingImage ? (
                      <>
                        <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>📷 Subir Imagen</>
                    )}
                  </button>
                  {form.image_url && (
                    <div className="flex items-center gap-2 text-teal-400">
                      <span>✓</span>
                      <span className="text-sm">Imagen cargada</span>
                    </div>
                  )}
                </div>
                {form.image_url && (
                  <div className="mt-3">
                    <img src={form.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-white/20" />
                  </div>
                )}
                <p className="text-white/40 text-xs mt-2">Formatos: JPG, PNG, GIF (Máx. 5MB)</p>
              </div>

              <textarea 
                className="p-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-white/40 focus:border-teal-500 focus:outline-none transition-colors md:col-span-2" 
                placeholder="Descripción" 
                rows={3} 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !form.image_url} 
              className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creando...' : '🚀 Crear y Generar Link'}
            </button>
            {!form.image_url && (
              <p className="text-red-400 text-sm text-center mt-2">⚠️ Debes subir una imagen</p>
            )}
          </form>
        )}

        {/* Lista de pujas */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Pujas Existentes ({auctions.length})</h2>
          {auctions.length === 0 && (
            <div className="bg-white/5 backdrop-blur rounded-2xl p-12 text-center border border-white/10">
              <div className="text-6xl mb-4"></div>
              <p className="text-white/60 text-lg">No hay pujas creadas aún</p>
            </div>
          )}
          {auctions.map(a => (
            <div key={a.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {a.image_url && (
                    <img src={a.image_url} alt={a.title} className="w-20 h-20 object-cover rounded-xl border border-white/20" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-white mb-2">{a.title}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={'px-3 py-1 rounded-full text-sm font-semibold ' + (a.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30')}>
                        {a.is_active ? ' Activa' : '🔴 Inactiva'}
                      </span>
                      <span className="text-white/60 text-sm">⏱️ {a.duration_seconds}s</span>
                    </div>
                    <a href={'/auction/' + a.id} target="_blank" className="inline-block mt-2 text-teal-400 hover:text-teal-300 text-sm font-mono">
                      🔗 /auction/{a.id.substring(0, 8)}...
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(a.id, a.is_active)} className={'px-4 py-2 rounded-lg font-semibold transition-all ' + (a.is_active ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30')}>
                    {a.is_active ? '️ Desactivar' : '▶️ Activar'}
                  </button>
                  <button onClick={() => deleteAuction(a.id)} className="px-4 py-2 bg-white/5 text-white/70 rounded-lg border border-white/20 hover:bg-red-500/20 hover:text-red-400 transition-all">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}