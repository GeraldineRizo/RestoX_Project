import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormularioInsumos({ negocioId, onInsumoAgregado, insumosExistentes, darkMode }) {
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
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    cargarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Buscar si el insumo ya existe para evitar duplicados
    const existente = insumosExistentes.find(i => 
      i.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
    );

    try {
      if (existente) {
        // --- LÓGICA DE ACTUALIZACIÓN (Fusión de Stock) ---
        let cantidadAFusionar = parseFloat(cantidad);

        // Conversión inteligente de unidades
        if (unidad === 'gr' && existente.unidad_medida === 'Kg') {
          cantidadAFusionar = cantidadAFusionar / 1000;
        } else if (unidad === 'ml' && existente.unidad_medida === 'Lt') {
          cantidadAFusionar = cantidadAFusionar / 1000;
        }

        // 1. Registrar el movimiento de entrada en el historial
        await axios.post('http://127.0.0.1:8000/api/movimientos/', {
          insumo: existente.id,
          tipo: 'ENTRADA',
          cantidad: cantidadAFusionar,
          motivo: `Compra nueva (Precio: $${precio})`
        }, { headers: { Authorization: `Bearer ${token}` } });

        // 2. Actualizar stock y precio en el insumo base
        await axios.patch(`http://127.0.0.1:8000/api/insumos/${existente.id}/`, {
          precio_costo: precio,
          stock_actual: parseFloat(existente.stock_actual) + cantidadAFusionar
        }, { headers: { Authorization: `Bearer ${token}` } });

      } else {
        // --- LÓGICA DE REGISTRO NUEVO ---
        await axios.post('http://127.0.0.1:8000/api/insumos/', {
          nombre: nombre.trim(),
          stock_actual: cantidad,
          stock_minimo_alerta: minimo, // Nombre exacto del modelo Django
          precio_costo: precio,
          unidad_medida: unidad,
          categoria: categoriaId, 
          negocio: negocioId
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      // Limpiar y refrescar
      setNombre(''); setCantidad(''); setMinimo(''); setPrecio('');
      onInsumoAgregado(); 
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("Error al procesar el insumo.");
    }
  };

  // Clases dinámicas para el Modo Oscuro
  const inputClass = darkMode 
    ? "border-gray-700 text-white focus:border-green-500 bg-transparent" 
    : "border-gray-200 focus:border-[#3C4623] bg-transparent";

  const selectClass = darkMode
    ? "bg-[#25281D] border-gray-700 text-white"
    : "bg-white border-gray-200 text-gray-800";

  return (
    <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-[#25281D] border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-3xl shadow-sm border transition-all duration-300`}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        
        {/* Nombre */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Insumo</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
            className={`w-full p-2 border-b outline-none text-sm transition-colors ${inputClass}`} required />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Categoría</label>
          <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}
            className={`w-full p-2 border-b outline-none text-sm ${selectClass}`} 
            required={!insumosExistentes.find(i => i.nombre.toLowerCase() === nombre.toLowerCase().trim())}>
            <option value="">Elegir...</option>
            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
          </select>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Costo Unit.</label>
          <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)}
            className={`w-full p-2 border-b outline-none text-sm ${inputClass}`} required />
        </div>

        {/* Stock y Mínimo */}
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Cant.</label>
            <input type="number" step="0.01" value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              className={`w-full p-2 border-b outline-none text-sm ${inputClass}`} required />
          </div>
          <div className="w-1/2">
            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Mín. Alerta</label>
            <input type="number" step="0.01" value={minimo} onChange={(e) => setMinimo(e.target.value)}
              className={`w-full p-2 border-b outline-none text-sm ${inputClass}`} />
          </div>
        </div>

        {/* Unidad */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Unidad</label>
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)}
            className={`w-full p-2 border-b outline-none text-sm ${selectClass}`}>
            <option value="Kg">Kg</option>
            <option value="gr">Gramos</option>
            <option value="Lt">Lt</option>
            <option value="ml">ml</option>
            <option value="Und">Und</option>
          </select>
        </div>

        {/* Botón */}
        <button type="submit" className="bg-[#3C4623] text-white py-2 rounded-xl font-bold hover:bg-black transition-all shadow-md">
          Guardar
        </button>
      </div>
    </form>
  );
}

export default FormularioInsumos;