import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TablaMovimientos({ darkMode }) {
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
    <div className={`overflow-x-auto rounded-3xl border ${darkMode ? 'bg-[#25281D] border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={`uppercase text-[10px] font-black tracking-widest ${darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-100'} border-b`}>
            <th className="p-5">Fecha</th>
            <th className="p-5">Insumo</th>
            <th className="p-5">Tipo</th>
            <th className="p-5">Cantidad</th>
            <th className="p-5">Motivo</th>
          </tr>
        </thead>
        <tbody className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {movimientos.map((m) => (
            <tr key={m.id} className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
              <td className="p-5 font-mono text-[11px]">{new Date(m.fecha).toLocaleString()}</td>
              <td className="p-5 font-bold">{m.insumo_nombre}</td>
              <td className="p-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                  m.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {m.tipo}
                </span>
              </td>
              <td className="p-5 font-black">{m.cantidad}</td>
              <td className="p-5 text-gray-400 italic">{m.motivo || 'Sin descripción'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaMovimientos;