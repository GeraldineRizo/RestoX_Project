import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Parametrizacion({ darkMode, colorMarca }) {
  // Estados de navegación
  const [moduloAjuste, setModuloAjuste] = useState('inicio'); // Inicia en presentación
  const [seccionActiva, setSeccionActiva] = useState('categorias');
  
  const [listaDatos, setListaDatos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [cargando, setCargando] = useState(false);

  const CONFIG_SECCIONES = {
    categorias: { titulo: "Categorías", endpoint: "http://127.0.0.1:8000/api/categorias/", placeholder: "Ej: Lácteos...", label: "Categoría" },
    marcas: { titulo: "Marcas", endpoint: "http://127.0.0.1:8000/api/marcas/", placeholder: "Ej: Nestlé...", label: "Marca" },
    unidades: { titulo: "Unidades", endpoint: "http://127.0.0.1:8000/api/unidades/", placeholder: "Ej: Caja...", label: "Unidad" }
  };

  const cargarDatos = async () => {
    if (moduloAjuste !== 'registros') return;
    const token = localStorage.getItem('token');
    setCargando(true);
    try {
      const res = await axios.get(CONFIG_SECCIONES[seccionActiva].endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListaDatos(res.data);
    } catch (err) {
      setListaDatos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [seccionActiva, moduloAjuste]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(CONFIG_SECCIONES[seccionActiva].endpoint, { nombre: nuevoNombre }, { headers: { Authorization: `Bearer ${token}` } });
      setNuevoNombre('');
      cargarDatos();
    } catch (err) { alert("Error al guardar"); }
  };

  const cardClass = darkMode ? "bg-[#25281D] border-gray-700 text-white" : "bg-white border-gray-100 shadow-sm text-gray-800";

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* NAVEGACIÓN DE AJUSTES */}
      <div className="flex flex-col md:flex-row md:items-center justify-end mb-10 gap-3">
        <div className="flex items-center gap-2 bg-black/5 p-2 rounded-2xl border border-white/5">
          <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Ajuste:</label>
          <select 
            value={moduloAjuste}
            onChange={(e) => setModuloAjuste(e.target.value)}
            className={`p-2 rounded-xl border-none outline-none font-bold text-xs uppercase cursor-pointer ${darkMode ? 'bg-[#1A1C14] text-white' : 'bg-white text-gray-800 shadow-sm'}`}
          >
            <option value="inicio">Seleccionar ajuste...</option>
            <option value="registros">Añadir registros a listas</option>
            <option value="perfil">Perfil del Negocio</option>
            <option value="seguridad">Seguridad</option>
          </select>
        </div>

        {/* Selector de Lista: Solo visible si seleccionó "registros" */}
        {moduloAjuste === 'registros' && (
          <div className="flex items-center gap-2 bg-black/5 p-2 rounded-2xl border border-white/5 animate-in slide-in-from-right-2">
            <label className="text-[9px] font-black text-gray-400 uppercase ml-2 tracking-widest">Lista:</label>
            <select 
              value={seccionActiva}
              onChange={(e) => setSeccionActiva(e.target.value)}
              className={`p-2 rounded-xl border-none outline-none font-bold text-xs uppercase cursor-pointer ${darkMode ? 'bg-[#1A1C14] text-white' : 'bg-white text-gray-800 shadow-sm'}`}
            >
              <option value="categorias">Categorías</option>
              <option value="marcas">Marcas</option>
              <option value="unidades">Unidades</option>
            </select>
          </div>
        )}
      </div>

      {/* CONTENIDO SEGÚN SELECCIÓN */}
      {moduloAjuste === 'inicio' ? (
        <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in-95 duration-500">
          <div className="mb-6 inline-flex p-4 rounded-full bg-black/5" style={{ color: colorMarca }}>
            <span className="text-4xl">⚙️</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Panel de Configuración</h2>
          <p className="text-sm text-gray-400 leading-relaxed font-medium">
            Desde este módulo puedes gestionar la estructura lógica de tu negocio. 
            Personaliza las listas de categorías, gestiona la información pública de tu marca 
            y controla los accesos de seguridad de tu equipo.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 opacity-50">
             <div className="text-[9px] font-black uppercase border-t pt-4 border-black/10">Control de Listas</div>
             <div className="text-[9px] font-black uppercase border-t pt-4 border-black/10">Identidad Visual</div>
             <div className="text-[9px] font-black uppercase border-t pt-4 border-black/10">Acceso Seguro</div>
          </div>
        </div>
      ) : moduloAjuste === 'registros' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`p-8 rounded-3xl border h-fit ${cardClass}`}>
            <h3 className="text-sm font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
               <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: colorMarca }}></span>
               Nueva {CONFIG_SECCIONES[seccionActiva].label}
            </h3>
            <form onSubmit={handleGuardar} className="space-y-6">
              <input 
                type="text" 
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder={CONFIG_SECCIONES[seccionActiva].placeholder}
                className={`w-full p-4 rounded-2xl border outline-none text-sm bg-transparent ${darkMode ? 'border-gray-600 focus:border-white' : 'border-gray-200 focus:border-black'}`}
                required
              />
              <button type="submit" className="w-full py-4 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg" style={{ backgroundColor: colorMarca }}>
                Guardar {CONFIG_SECCIONES[seccionActiva].label}
              </button>
            </form>
          </div>

          <div className={`lg:col-span-2 p-8 rounded-3xl border ${cardClass}`}>
            <h3 className="text-sm font-black uppercase tracking-tighter mb-6">Registros Actuales</h3>
            {cargando ? (
              <div className="py-20 text-center animate-pulse text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {listaDatos.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center ${darkMode ? 'border-gray-800 bg-black/20' : 'border-gray-50 bg-gray-50'}`}>
                    <span className="text-sm font-bold uppercase">{item.nombre}</span>
                    <span className="text-[8px] font-black text-gray-400 uppercase bg-black/10 px-2 py-1 rounded">ID: {item.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-20 text-center opacity-30 font-black uppercase tracking-[0.3em] text-xs">
          Módulo de {moduloAjuste} en desarrollo
        </div>
      )}
    </div>
  );
}

export default Parametrizacion;