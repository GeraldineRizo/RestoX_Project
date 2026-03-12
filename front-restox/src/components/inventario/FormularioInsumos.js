import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const CONVERSIONES = { 'gr': 0.001, 'Kg': 1, 'ml': 0.001, 'Lt': 1, 'Und': 1 };

const GRUPOS_UNIDADES = {
  peso: ['Kg', 'gr'],
  volumen: ['Lt', 'ml'],
  conteo: ['Und']
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
      try {
        const res = await api.get('categorias/');
        setCategorias(res.data);
      } catch (err) { console.error("Error cargando categorías:", err); }
    };
    cargarCategorias();
  }, []);

  // CÁLCULO DINÁMICO DEL TOTAL INVERTIDO
  const totalInvertido = insumosExistentes?.reduce((acc, insumo) => {
    const stock = parseFloat(insumo.stock_actual) || 0;
    const costo = parseFloat(insumo.precio_costo_actual) || 0;
    return acc + (stock * costo);
  }, 0);

  // Detección de insumo existente
  const existente = insumosExistentes?.find(
    i => i.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
  );

  // Filtrado de unidades permitidas
  const getUnidadesPermitidas = () => {
    if (!existente) return ['Kg', 'gr', 'Lt', 'ml', 'Und'];
    const udBase = existente.unidad_medida;
    if (GRUPOS_UNIDADES.peso.includes(udBase)) return GRUPOS_UNIDADES.peso;
    if (GRUPOS_UNIDADES.volumen.includes(udBase)) return GRUPOS_UNIDADES.volumen;
    return GRUPOS_UNIDADES.conteo;
  };

  useEffect(() => {
    if (existente) {
      const permitidas = getUnidadesPermitidas();
      if (!permitidas.includes(unidad)) setUnidad(permitidas[0]);
    }
  }, [nombre, existente]);

  // VALIDACIONES DE ENTRADA
  const handleNombreChange = (e) => {
    const val = e.target.value;
    const soloLetras = val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNombre(soloLetras);
  };

  const validateNumber = (val) => {
    return val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!negocioId) return alert("Error: No se detectó el negocio.");

    const factor = CONVERSIONES[unidad] || 1;
    const valorCantidad = parseFloat(cantidad) || 0;
    const cantidadASumar = valorCantidad * factor;

    try {
      if (existente) {
        const nuevoStockCalculado = parseFloat(existente.stock_actual) + cantidadASumar;
        const stockFinal = Math.round(nuevoStockCalculado * 100) / 100;
        const updateData = {
          precio_costo_actual: parseFloat(precio),
          stock_actual: stockFinal
        };
        await api.patch(`insumos/${existente.id}/`, updateData);
      } else {
        const newData = {
          nombre: nombre.trim(),
          precio_costo_actual: parseFloat(precio),
          unidad_medida: (unidad === 'gr' ? 'Kg' : (unidad === 'ml' ? 'Lt' : unidad)),
          stock_actual: Math.round(cantidadASumar * 100) / 100,
          stock_minimo: Math.round(parseFloat(minimo || 0) * 100) / 100,
          categoria: parseInt(categoriaId),
          negocio: negocioId
        };
        await api.post('insumos/', newData);
      }
      setNombre(''); setCantidad(''); setMinimo(''); setPrecio(''); setCategoriaId('');
      onInsumoAgregado();
      alert("Operación exitosa");
    } catch (err) {
      alert(`Error del servidor: ${JSON.stringify(err.response?.data)}`);
    }
  };

  const bgCard = darkMode ? "bg-[#1C1F15]" : "bg-[#EBEBE8]";
  const textColor = darkMode ? "text-white" : "text-[#3C4623]";
  const inputClass = `bg-transparent border-b border-[#BCBCB4] p-3 text-xs outline-none focus:border-[#3C4623] transition-all ${textColor}`;

  return (
    <div className={`${bgCard} p-8 rounded-[2.5rem] border ${darkMode ? 'border-gray-800' : 'border-[#D1D1CC]'} shadow-lg mb-10`}>
      
      {/* SECCIÓN SUPERIOR: TÍTULO Y TOTAL INVERTIDO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tighter ${textColor}`}>
            {existente ? 'Actualizar Existencias' : 'Registro de Insumos'}
          </h2>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Gestión de capital en stock</p>
        </div>

        <div className={`flex flex-col items-end p-4 rounded-2xl border ${darkMode ? 'bg-[#25281D] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Inversión Total</span>
          <span className="text-2xl font-black tracking-tighter" style={{ color: colorMarca }}>
            ${totalInvertido.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-flow-col lg:auto-cols-fr gap-6 items-end">
        {/* Campo Nombre */}
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Insumo</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={handleNombreChange} 
            className={inputClass} 
            required 
            placeholder="Solo letras..."
            autoComplete="off" 
          />
          {existente && <span className="text-[8px] font-bold text-orange-500 uppercase mt-1">Detectado ({existente.unidad_medida})</span>}
        </div>

        {/* Campo Categoría (Oculto si existe) */}
        {!existente && (
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputClass} required>
              <option value="">Elegir...</option>
              {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
        )}

        {/* Campo Costo */}
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Costo Unit. ($)</label>
          <input 
            type="text" 
            value={precio} 
            onChange={(e) => setPrecio(validateNumber(e.target.value))} 
            className={inputClass} 
            required 
          />
        </div>

        {/* Campo Cantidad y Unidades */}
        <div className="flex flex-col">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Cantidad</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={cantidad} 
              onChange={(e) => setCantidad(validateNumber(e.target.value))} 
              className={`${inputClass} flex-1`} 
              required 
            />
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={`${inputClass} w-20 font-bold`}>
              {getUnidadesPermitidas().map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Campo Stock Mínimo (Oculto si existe) */}
        {!existente && (
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Mínimo</label>
            <input 
              type="text" 
              value={minimo} 
              onChange={(e) => setMinimo(validateNumber(e.target.value))} 
              className={inputClass} 
              required 
            />
          </div>
        )}

        {/* Botón de envío */}
        <button 
          type="submit" 
          className="h-[52px] rounded-2xl font-black uppercase text-[10px] text-white tracking-widest shadow-md transition-all active:scale-95" 
          style={{ backgroundColor: colorMarca }}
        >
          {existente ? 'Actualizar' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

export default FormularioInsumos;