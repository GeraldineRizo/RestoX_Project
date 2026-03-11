import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CONVERSIONES = {
  'gr': 0.001,
  'Kg': 1,
  'ml': 0.001,
  'Lt': 1,
  'Und': 1
};

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
      } catch (err) { console.error("Error cargando categorías:", err); }
    };
    cargarCategorias();
  }, []);

  const existente = insumosExistentes.find(i =>
    i.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
  );

  const handleNombreChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      setNombre(value);
    }
  };

  const handleNumericChange = (value, setter) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const factor = CONVERSIONES[unidad] || 1;
    const cantidadFinal = parseFloat(cantidad) * factor;

    try {
      if (existente) {
        await axios.patch(`http://127.0.0.1:8000/api/insumos/${existente.id}/`, {
          precio_costo: parseFloat(precio),
          stock_actual: parseFloat(existente.stock_actual) + cantidadFinal
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://127.0.0.1:8000/api/insumos/', {
          nombre: nombre.trim(),
          stock_actual: cantidadFinal,
          stock_minimo_alerta: minimo || 0,
          precio_costo: precio,
          unidad_medida: (unidad === 'gr' ? 'Kg' : (unidad === 'ml' ? 'Lt' : unidad)),
          categoria: categoriaId,
          negocio: negocioId
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setNombre(''); setCantidad(''); setMinimo(''); setPrecio('');
      onInsumoAgregado();
    } catch (err) { console.error("Error:", err); }
  };

  const inputClass = darkMode ? "border-gray-700 text-white" : "border-gray-200 text-gray-800";
  const selectClass = darkMode ? "bg-[#25281D] border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800";

  return (
    <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-[#25281D] border-gray-700' : 'bg-white border-gray-100 shadow-sm'} p-4 rounded-2xl border mb-6 transition-all`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Insumo</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={handleNombreChange} 
            className={`p-1.5 border-b outline-none text-xs bg-transparent ${inputClass}`} 
            style={{ borderBottomColor: existente ? '#F59E0B' : '' }} 
            required 
          />
          {existente && <p className="text-[8px] text-orange-500 font-bold mt-0.5 uppercase">Existente</p>}
        </div>

        {!existente && (
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Categoría</label>
            <select 
              value={categoriaId} 
              onChange={(e) => setCategoriaId(e.target.value)} 
              className={`p-1.5 border-b outline-none text-xs ${selectClass}`} 
              required
            >
              <option value="">Elegir...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Precio</label>
          <input 
            type="text" 
            value={precio} 
            onChange={(e) => handleNumericChange(e.target.value, setPrecio)} 
            className={`p-1.5 border-b outline-none text-xs bg-transparent ${inputClass}`} 
            required 
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Cantidad</label>
            <input 
              type="text" 
              value={cantidad} 
              onChange={(e) => handleNumericChange(e.target.value, setCantidad)} 
              className={`w-full p-1.5 border-b outline-none text-xs bg-transparent ${inputClass}`} 
              required 
            />
          </div>
          <div className="w-20">
            <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Unidad</label>
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={`w-full p-1.5 border-b outline-none text-[9px] font-bold ${selectClass}`}>
              <option value="Kg">Kg</option>
              <option value="gr">Gr</option>
              <option value="Lt">Lt</option>
              <option value="ml">ml</option>
              <option value="Und">Und</option>
            </select>
          </div>
        </div>

        {!existente && (
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-400 mb-1 uppercase tracking-widest">Mínimo</label>
            <input 
              type="text" 
              value={minimo} 
              onChange={(e) => handleNumericChange(e.target.value, setMinimo)} 
              className={`p-1.5 border-b outline-none text-xs bg-transparent ${inputClass}`} 
            />
          </div>
        )}

        <button 
          type="submit" 
          className="lg:col-start-4 text-white py-2 rounded-lg font-bold hover:opacity-90 transition-all shadow-sm uppercase text-[10px]"
          style={{ backgroundColor: colorMarca }}
        >
          {existente ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

export default FormularioInsumos;