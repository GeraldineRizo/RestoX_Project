import React, { useState } from 'react';

const Icon = ({ path, size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const Sidebar = ({ activeModule, setActiveModule, isDarkMode, toggleDarkMode, negocio, colorPrimario, colorSecundario }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getIniciales = (nombre) => {
    if (!nombre) return "??";
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { id: 'inventario', label: 'Inventario', path: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
    { id: 'movimientos', label: 'Movimientos', path: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" },
    { id: 'ajustes', label: 'Ajustes', path: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Limpia el token y datos guardados
    window.location.href = '/login'; // Redirige al login
  };

  return (
    <div 
      className={`h-screen transition-all duration-300 flex flex-col border-r relative ${
        isDarkMode ? 'bg-[#1C1F15] border-zinc-800' : 'bg-[#F9F8F3] border-zinc-200'
      } ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Botón de Colapso */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute -right-3 top-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
          isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-600'
        } z-50`}
      >
        <Icon path={isExpanded ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} size={14} />
      </button>

      {/* Perfil del Negocio */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div 
          className="min-w-[32px] h-8 rounded flex items-center justify-center text-white font-black shrink-0"
          style={{ backgroundColor: colorSecundario }}
        >
          {getIniciales(negocio?.nombre)}
        </div>
        {isExpanded && (
          <div className="flex flex-col leading-none overflow-hidden text-left">
            <span className={`font-black tracking-tighter text-sm uppercase truncate ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
              {negocio?.nombre || "ARVI COFFEE"}
            </span>
            <span className="text-[8px] font-bold text-zinc-500 tracking-widest uppercase mt-1">Partner RestoX</span>
          </div>
        )}
      </div>

      {/* Navegación Principal */}
      <nav className="flex-1 px-3 space-y-2 mt-8 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              activeModule === item.id 
                ? (isDarkMode ? 'bg-[#25281D] text-white' : 'bg-[#E8E2D2] text-zinc-900') 
                : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-800')
            }`}
          >
            <div className="shrink-0" style={{ color: activeModule === item.id ? colorPrimario : 'inherit' }}>
              <Icon path={item.path} />
            </div>
            {isExpanded && (
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Pie del Sidebar: Tema y Salida */}
      <div className={`p-3 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
        
        {/* Toggle Modo Oscuro/Claro */}
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-4 p-3 mb-1 text-zinc-500 hover:text-yellow-500 transition-colors rounded-xl"
        >
          <div className="shrink-0">
            <Icon path={isDarkMode 
              ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" 
              : "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            } />
          </div>
          {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>}
        </button>

        {/* Botón de Cerrar Sesión */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-3 text-zinc-500 hover:text-red-500 transition-colors rounded-xl"
        >
          <div className="shrink-0">
            <Icon path="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </div>
          {isExpanded && <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>}
        </button>
        
      </div>
    </div>
  );
};

export default Sidebar;