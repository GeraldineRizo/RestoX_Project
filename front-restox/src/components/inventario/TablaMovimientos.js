import React from 'react';

function TablaMovimientos({ movimientos = [], darkMode, colorMarca }) {
  const containerClass = darkMode ? 'bg-[#25281D] border-zinc-800' : 'bg-white border-gray-100 shadow-sm';
  const rowBorderClass = darkMode ? 'border-zinc-800' : 'border-gray-100';

  return (
    <div className={`overflow-x-auto rounded-3xl border transition-all duration-300 ${containerClass}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`uppercase text-[10px] font-black tracking-widest border-b ${rowBorderClass} ${darkMode ? 'text-zinc-500' : 'text-gray-400'}`}>
            <th className="p-5">Fecha</th>
            <th className="p-5">Insumo</th>
            <th className="p-5">Tipo</th>
            <th className="p-5 text-right">Cantidad</th>
          </tr>
        </thead>
        <tbody className={`text-xs ${darkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
          {movimientos.map((m) => {
            const esEntrada = m.tipo === 'E' || m.tipo === 'ENTRADA';
            return (
              <tr key={m.id} className={`border-b last:border-0 ${rowBorderClass} hover:bg-white/5`}>
                <td className="p-5 font-mono text-[10px] opacity-60">
                  {m.fecha ? new Date(m.fecha).toLocaleDateString('es-ES', {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'}) : '---'}
                </td>
                <td className="p-5 font-black uppercase tracking-tight">{m.insumo_nombre}</td>
                <td className="p-5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${esEntrada ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                    {esEntrada ? 'ENTRADA' : 'SALIDA'}
                  </span>
                </td>
                <td className={`p-5 text-right font-black ${esEntrada ? 'text-white' : 'text-red-400'}`}>
                  {esEntrada ? '+' : '-'}{m.cantidad}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {movimientos.length === 0 && (
        <div className="p-20 text-center opacity-40">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No hay actividad registrada</p>
        </div>
      )}
    </div>
  );
}

export default TablaMovimientos;