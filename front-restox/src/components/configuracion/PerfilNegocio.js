import React, { useState } from 'react';
import axios from 'axios';
import { Save, Upload } from 'lucide-react';

function PerfilNegocio({ negocio, onActualizar, colorMarca, darkMode }) {
  const [nombre, setNombre] = useState(negocio?.nombre_comercial || negocio?.nombre || '');
  const [color, setColor] = useState(negocio?.color_principal || colorMarca);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(negocio?.logo || null);
  const [cargando, setCargando] = useState(false);

  const guardar = async (e) => {
    e.preventDefault();
    setCargando(true);
    const formData = new FormData();
    formData.append('nombre_comercial', nombre);
    formData.append('color_principal', color);
    if (logo) formData.append('logo', logo);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`http://127.0.0.1:8000/api/negocios/${negocio.id}/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      onActualizar(res.data);
      alert("Configuración guardada");
    } catch (err) {
      console.error(err);
    } finally { setCargando(false); }
  };

  const inputClass = `bg-transparent border-b border-zinc-400/30 p-3 text-xs outline-none focus:border-zinc-800 transition-all ${darkMode ? 'text-white' : 'text-zinc-800'}`;

  return (
    <form onSubmit={guardar} className={`p-8 rounded-[2.5rem] border ${darkMode ? 'bg-[#1C1F15] border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Columna Logo */}
        <div className="flex flex-col items-center justify-center border-r border-zinc-400/10 pr-10">
          <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-zinc-500/30 flex items-center justify-center overflow-hidden mb-4 bg-black/5">
            {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" /> : <Upload className="text-zinc-400" />}
          </div>
          <label className="text-[9px] font-black uppercase tracking-[0.2em] cursor-pointer py-2 px-4 rounded-full border border-zinc-400/20 hover:bg-zinc-500/10 transition-all">
            Cambiar Logo
            <input type="file" className="hidden" onChange={(e) => {
              setLogo(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }} />
          </label>
        </div>

        {/* Columna Datos */}
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nombre del Negocio</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} />
            </div>
            <div className="flex flex-col">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Color de Marca</label>
              <div className="flex items-center gap-4">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-10 cursor-pointer bg-transparent border-none" />
                <span className="text-xs font-mono font-bold">{color}</span>
              </div>
            </div>
          </div>

          <button 
            disabled={cargando}
            className="group flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] text-white shadow-xl transition-all active:scale-95"
            style={{ backgroundColor: colorMarca }}
          >
            <Save size={16} />
            {cargando ? 'Guardando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PerfilNegocio;