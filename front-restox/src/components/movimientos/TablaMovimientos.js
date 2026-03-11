import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Recibimos colorMarca para que los acentos de la tabla coincidan con el negocio
function TablaMovimientos({ darkMode, colorMarca }) {
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    const fetchMovimientos = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/movimientos/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovimientos(res.data);
      } catch (err) {
        console.error("Error al cargar movimientos:", err);
      }
    };
    fetchMovimientos();
  }, []);

  return (
    <div className={`overflow-x-auto rounded-3xl border transition-all duration-300 ${
      darkMode ? 'bg-[#25281D] border-gray-700' : 'bg-white border-gray-100'
    } shadow-sm`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`uppercase text-[10px] font-black tracking-widest border-b ${
            darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-100'
          }`}>
            <th className="p-5">Fecha</th>
            <th className="p-5">Insumo</th>
            <th className="p-5">Tipo</th>
            <th className="p-5">Cantidad</th>
            <th className="p-5 text-right">Motivo</th>
          </tr>
        </thead>
        <tbody className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {movimientos.map((m) => (
            <tr key={m.id} className={`border-b transition-colors ${
              darkMode ? 'border-gray-800 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50/50'
            }`}>
              <td className="p-5 font-mono text-[10px] opacity-60">
                {new Date(m.fecha).toLocaleString()}
              </td>
              <td className="p-5 font-black uppercase tracking-tighter">{m.insumo_nombre}</td>
              <td className="p-5">
                <span 
                  className="px-3 py-1 rounded-full text-[9px] font-black tracking-widest"
                  style={{ 
                    // Si es entrada, usamos el color de la marca con transparencia
                    backgroundColor: m.tipo === 'ENTRADA' ? `${colorMarca}20` : '#FEE2E2',
                    color: m.tipo === 'ENTRADA' ? colorMarca : '#EF4444',
                    border: `1px solid ${m.tipo === 'ENTRADA' ? `${colorMarca}40` : '#FECACA'}`
                  }}
                >
                  {m.tipo}
                </span>
              </td>
              <td className="p-5 font-black">
                {m.tipo === 'ENTRADA' ? '+' : '-'}{m.cantidad}
              </td>
              <td className="p-5 text-right text-[11px] text-gray-400 italic">
                {m.motivo || 'Sin descripción'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {movimientos.length === 0 && (
        <div className="p-20 text-center text-gray-400 font-black uppercase text-xs tracking-widest">
          No hay registros de movimientos aún
        </div>
      )}
    </div>
  );
}

export default TablaMovimientos;