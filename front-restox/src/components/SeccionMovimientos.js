import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CONVERSIONES = { 'gr': 0.001, 'Kg': 1, 'ml': 0.001, 'Lt': 1, 'Und': 1 };

function FormularioInsumos({ negocioId, onInsumoAgregado, insumosExistentes, darkMode, colorMarca }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [minimo, setMinimo] = useState('');
  const [precio, setPrecio] = useState('');
  const [unidad, setUnidad] = useState('Kg');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarCategorias = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/categorias/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(res.data);
      } catch (err) { console.error("Error:", err); }
    };
    cargarCategorias();
  }, []);

  const existente = insumosExistentes?.find(i => i.nombre.toLowerCase().trim() === nombre.toLowerCase().trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!negocioId) return alert("Error: No se detectó el negocio.");

    const token = localStorage.getItem('token');
    const factor = CONVERSIONES[unidad] || 1;
    const cantidadFinal = parseFloat(cantidad) * factor;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const commonData = {
        nombre: nombre.trim(),
        precio_costo: parseFloat(precio),
        unidad_medida: (unidad === 'gr' ? 'Kg' : (unidad === 'ml' ? 'Lt' : unidad)),
        negocio: negocioId
      };

      if (existente) {
        await axios.patch(`http://127.0.0.1:8000/api/insumos/${existente.id}/`, {
          ...commonData,
          stock_actual: parseFloat(existente.stock_actual) + cantidadFinal
        }, { headers });
      } else {
        await axios.post('http://127.0.0.1:8000/api/insumos/', {
          ...commonData,
          stock_actual: cantidadFinal,
          stock_minimo_alerta: parseFloat(minimo) || 0,
          categoria: parseInt(categoriaId)
        }, { headers });
      }
      
      setNombre(''); setCantidad(''); setMinimo(''); setPrecio('');
      onInsumoAgregado();
      alert("Registro exitoso.");
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("Error al guardar. Revisa los datos.");
    }
  };

  const bgCard = darkMode ? "bg-[#1C1F15]" : "bg-[#EBEBE8]";
  const textColor = darkMode ? "text-white" : "text-[#3C4623]";
  const inputClass = `bg-transparent border-b border-[#BCBCB4] p-3 text-xs outline-none focus:border-[#3C4623] transition-all ${textColor}`;

  return (
    <div className={`${bgCard} p-8 rounded-[2.5rem] border ${darkMode ? 'border-gray-800' : 'border-[#D1D1CC]'} shadow-lg mb-10`}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-flow-col lg:auto-cols-fr gap-6 items-end">
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Insumo</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} required />
        </div>
        {!existente && (
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputClass} required>
              <option value="">Elegir...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
        )}
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Costo ($)</label>
          <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className={inputClass} required />
        </div>
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Cantidad</label>
          <div className="flex gap-2">
            <input type="number" step="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={`${inputClass} flex-1`} required />
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={`${inputClass} w-20 font-bold`}>
              <option value="Kg">Kg</option><option value="gr">gr</option><option value="Lt">Lt</option><option value="ml">ml</option><option value="Und">Und</option>
            </select>
          </div>
        </div>
        <button type="submit" className="h-[52px] rounded-2xl font-black uppercase text-[10px] text-white tracking-widest shadow-md transition-all hover:scale-95" style={{ backgroundColor: colorMarca }}>
          {existente ? 'Sincronizar' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

export default FormularioInsumos;