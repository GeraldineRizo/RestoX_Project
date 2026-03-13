import React, { useEffect } from 'react';

const Toast = ({ mensaje, tipo = 'success', onClose, darkMode, colorMarca }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Posicionamiento superior central
  const positionClass = "fixed top-10 left-1/2 -translate-x-1/2 z-[100]";
  const bgClass = darkMode ? 'bg-[#1C1F15] border-zinc-800 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl';
  const iconColor = tipo === 'success' ? colorMarca : '#ef4444';

  return (
    <div className={`${positionClass} flex items-center gap-3 p-4 rounded-2xl border min-w-[300px] transition-all duration-500 ease-out transform translate-y-0 ${bgClass}`}>
      <div 
        className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: iconColor }}
      >
        {tipo === 'success' ? '✓' : '!'}
      </div>
      <div className="flex-1">
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${darkMode ? 'text-white' : 'text-[#3C4623]'}`}>
          {tipo === 'success' ? 'Notificación' : 'Atención'}
        </p>
        <p className="text-[11px] text-zinc-500 font-bold uppercase">{mensaje}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-zinc-400 hover:text-zinc-600 font-bold text-lg">×</button>
    </div>
  );
};

export default Toast;