import React, { useState } from 'react';
import { User, Tag, Settings } from 'lucide-react';
import PerfilNegocio from "../configuracion/PerfilNegocio"
// Si tienes un componente de categorías, impórtalo aquí. 
// Si no, puedes crear un placeholder por ahora.
const CategoriasPlaceholder = () => (
  <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest opacity-30">
    Gestión de Categorías en desarrollo...
  </div>
);

function Parametrizacion({ negocio, onActualizarNegocio, darkMode, colorMarca }) {
  const [tabInterna, setTabInterna] = useState('perfil');

  const tabs = [
    { id: 'perfil', label: 'Identidad Visual', icon: <User size={14} /> },
    { id: 'categorias', label: 'Categorías de Insumos', icon: <Tag size={14} /> }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-white/5 shadow-sm">
          <Settings size={20} style={{ color: colorMarca }} />
        </div>
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tighter ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
            Parametrización
          </h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Configuración general del sistema</p>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <div className={`flex gap-2 p-1.5 rounded-2xl w-fit ${darkMode ? 'bg-zinc-900/50' : 'bg-zinc-200/50'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabInterna(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              tabInterna === tab.id 
                ? 'bg-white shadow-lg' 
                : 'text-zinc-500 hover:opacity-70'
            }`}
            style={tabInterna === tab.id ? { color: colorMarca } : {}}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido dinámico según la pestaña */}
      <div className="mt-6">
        {tabInterna === 'perfil' ? (
          <PerfilNegocio 
            negocio={negocio} 
            onActualizar={onActualizarNegocio} 
            colorMarca={colorMarca} 
            darkMode={darkMode} 
          />
        ) : (
          <CategoriasPlaceholder />
        )}
      </div>
    </div>
  );
}

export default Parametrizacion;