import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import Toast from '../common/Toast';

const CONVERSIONES = { 'gr': 0.001, 'Kg': 1, 'ml': 0.001, 'Lt': 1, 'Und': 1 };
const GRUPOS_UNIDADES = { peso: ['Kg', 'gr'], volumen: ['Lt', 'ml'], conteo: ['Und'] };

function FormularioInsumos({ negocioId, onInsumoAgregado, insumosExistentes, darkMode, colorMarca }) {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [minimo, setMinimo] = useState('');
  const [precio, setPrecio] = useState('');
  const [unidad, setUnidad] = useState('Kg');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [notificacion, setNotificacion] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await api.get('categorias/');
        setCategorias(res.data);
      } catch (err) { console.error("Error cargando categorías:", err); }
    };
    cargarCategorias();
  }, []);

  const totalInvertido = useMemo(() => {
    return insumosExistentes?.reduce((acc, insumo) => {
      const stock = parseFloat(insumo.stock_actual) || 0;
      const costo = parseFloat(insumo.precio_costo_actual) || 0;
      return acc + (stock * costo);
    }, 0) || 0;
  }, [insumosExistentes]);

  const existente = useMemo(() => {
    if (!nombre.trim()) return null;
    return insumosExistentes?.find(
      i => i.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
    );
  }, [nombre, insumosExistentes]);

  const getUnidadesPermitidas = () => {
    if (!existente) return ['Kg', 'gr', 'Lt', 'ml', 'Und'];
    const udBase = existente.unidad_medida;
    if (GRUPOS_UNIDADES.peso.includes(udBase)) return GRUPOS_UNIDADES.peso;
    if (GRUPOS_UNIDADES.volumen.includes(udBase)) return GRUPOS_UNIDADES.volumen;
    return GRUPOS_UNIDADES.conteo;
  };

  const handleNombreChange = (e) => {
    const val = e.target.value;
    setNombre(val.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''));
  };

  const validateNumber = (val) => val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!negocioId) return setNotificacion({ mensaje: "Error de Negocio ID", tipo: 'error' });

    setCargando(true);
    const factor = CONVERSIONES[unidad] || 1;
    const valorCantidad = parseFloat(cantidad) || 0;
    const montoPagado = parseFloat(precio) || 0;
    const cantidadEnBase = valorCantidad * factor;
    const costoUnitarioCalculado = montoPagado / valorCantidad;

    try {
      if (existente) {
        const nuevoStockCalculado = parseFloat(existente.stock_actual) + cantidadEnBase;
        await api.patch(`insumos/${existente.id}/`, {
          precio_costo_actual: costoUnitarioCalculado,
          stock_actual: Math.round(nuevoStockCalculado * 100) / 100
        });
        setNotificacion({ mensaje: `Stock de ${existente.nombre} actualizado`, tipo: 'success' });
      } else {
        await api.post('insumos/', {
          nombre: nombre.trim(),
          precio_costo_actual: costoUnitarioCalculado,
          unidad_medida: (unidad === 'gr' ? 'Kg' : (unidad === 'ml' ? 'Lt' : unidad)),
          stock_actual: Math.round(cantidadEnBase * 100) / 100,
          stock_minimo: Math.round(parseFloat(minimo || 0) * 100) / 100,
          categoria: parseInt(categoriaId),
          negocio: negocioId
        });
        setNotificacion({ mensaje: `${nombre} registrado con éxito`, tipo: 'success' });
      }
      setNombre(''); setCantidad(''); setMinimo(''); setPrecio(''); setCategoriaId('');
      onInsumoAgregado();
    } catch (err) {
      setNotificacion({ mensaje: "Error al guardar", tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const bgCard = darkMode ? "bg-[#1C1F15]" : "bg-[#EBEBE8]";
  const textColor = darkMode ? "text-white" : "text-[#3C4623]";
  const inputClass = `bg-transparent border-b border-[#BCBCB4] p-3 text-xs outline-none focus:border-[#3C4623] transition-all appearance-none ${textColor}`;

  return (
    <div className={`${bgCard} p-8 rounded-[2.5rem] border ${darkMode ? 'border-gray-800' : 'border-[#D1D1CC]'} shadow-lg mb-10 relative`}>

      {notificacion && (
        <Toast
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          darkMode={darkMode}
          colorMarca={colorMarca}
          onClose={() => setNotificacion(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-xl font-black uppercase tracking-tighter ${textColor}`}>
            {existente ? 'Reponer Inventario' : 'Nuevo Insumo'}
          </h2>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Entrada de mercancía</p>
        </div>

        <div className={`text-right p-4 rounded-2xl border ${darkMode ? 'bg-[#25281D] border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Valor Total en Stock</p>
          <p
            className="text-2xl font-black tracking-tighter"
            style={{
              color: colorMarca,
              filter: darkMode ? 'brightness(1.5) saturate(1.2)' : 'none',
              textShadow: darkMode ? `0 0 20px ${colorMarca}33` : 'none'
            }}
          >
            ${totalInvertido.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-x-8 gap-y-10 items-end">

        {/* Nombre Insumo */}
        <div className="flex flex-col relative flex-[1.5] min-w-[180px]">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Nombre Insumo</label>
          <input type="text" value={nombre} onChange={handleNombreChange} className={inputClass} required autoComplete="off" />
          {existente && (
            <span className="absolute -bottom-6 text-[8px] font-black text-orange-500 uppercase tracking-tighter bg-orange-500/10 px-2 py-0.5 rounded">
              Existente ({existente.unidad_medida})
            </span>
          )}
        </div>

        {/* Categoría */}
        {!existente && (
          <div className="flex flex-col flex-[1.2] min-w-[180px]">
            <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Categoría</label>
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={inputClass} required>
              <option value="">Seleccionar...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id} className={darkMode ? "bg-[#1C1F15]" : "bg-white"}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        )}

        {/* Inversión */}
        <div className="flex flex-col w-[110px] shrink-0">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Inversión ($)</label>
          <input type="text" value={precio} onChange={(e) => setPrecio(validateNumber(e.target.value))} className={inputClass} required placeholder="0.00" />
        </div>

        {/* Cantidad y Unidad con ancho fijo asegurado */}
        <div className="flex flex-col w-[160px] shrink-0">
          <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Cantidad</label>
          <div className="flex items-center border-b border-[#BCBCB4]">
            <input
              type="text"
              value={cantidad}
              onChange={(e) => setCantidad(validateNumber(e.target.value))}
              className="bg-transparent p-3 text-xs outline-none w-20 appearance-none"
              required
              placeholder="0"
            />
            <select
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="bg-transparent p-3 text-xs outline-none font-black w-16 cursor-pointer"
            >
              {getUnidadesPermitidas().map(u => (
                <option key={u} value={u} className={darkMode ? "bg-[#1C1F15]" : "bg-white"}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock Mínimo con ancho fijo para evitar colisión */}
        {!existente && (
          <div className="flex flex-col w-[90px] shrink-0">
            <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Stock Mín.</label>
            <input type="text" value={minimo} onChange={(e) => setMinimo(validateNumber(e.target.value))} className={inputClass} required placeholder="0" />
          </div>
        )}

        {/* Botón */}
        <button
          type="submit"
          disabled={cargando}
          className={`h-[42px] rounded-xl font-black uppercase text-[9px] text-white tracking-[0.2em] shadow-lg transition-all px-6 min-w-[120px] ${cargando ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}`}
          style={{
            backgroundColor: colorMarca,
            boxShadow: `0 10px 20px -10px ${colorMarca}66`
          }}
        >
          {cargando ? '...' : (existente ? 'Actualizar' : 'Registrar')}
        </button>
      </form>
    </div>
  );
}

export default FormularioInsumos;