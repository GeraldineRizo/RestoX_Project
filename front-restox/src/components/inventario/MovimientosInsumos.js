import React, { useState } from 'react';
import axios from 'axios';
import FormularioInsumos from './FormularioInsumos';

function MovimientosInsumos({ insumos, onMovimientoRealizado, darkMode, colorMarca, negocioId }) {
    const [movimiento, setMovimiento] = useState({ insumo: '', tipo: 'S', cantidad: '', motivo: '' });
    const [mostrarNuevoInsumo, setMostrarNuevoInsumo] = useState(false);

    const handleInputChange = (e) => setMovimiento({ ...movimiento, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!negocioId) return alert("Error: No se detectó el negocio.");

        try {
            await axios.post('http://127.0.0.1:8000/api/movimientos/', {
                insumo: parseInt(movimiento.insumo),
                tipo: movimiento.tipo,
                cantidad: parseFloat(movimiento.cantidad),
                motivo: movimiento.motivo,
                negocio: negocioId
            }, { headers: { Authorization: `Bearer ${token}` } });

            setMovimiento({ insumo: '', tipo: 'S', cantidad: '', motivo: '' });
            onMovimientoRealizado();
            alert("Operación registrada.");
        } catch (err) {
            console.error("Error:", err.response?.data);
            alert("Error al registrar movimiento.");
        }
    };

    const bgCard = darkMode ? "bg-[#1C1F15]" : "bg-[#EBEBE8]";
    const textColor = darkMode ? "text-white" : "text-[#3C4623]";
    const labelColor = darkMode ? "text-gray-500" : "text-[#7A7A72]";
    const inputClass = `bg-transparent border-b ${darkMode ? 'border-gray-700/50' : 'border-[#BCBCB4]'} p-3 text-xs outline-none focus:border-[#3C4623] transition-all ${textColor}`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h2 className={`text-[11px] font-black ${labelColor} uppercase tracking-[0.4em]`}>Inventario</h2>
                <button onClick={() => setMostrarNuevoInsumo(!mostrarNuevoInsumo)} className="text-[10px] font-black uppercase tracking-widest" style={{ color: colorMarca }}>
                    {mostrarNuevoInsumo ? "− Cerrar" : "+ Nuevo Insumo / Compra"}
                </button>
            </div>

            {mostrarNuevoInsumo && (
                <FormularioInsumos negocioId={negocioId} onInsumoAgregado={() => { onMovimientoRealizado(); setMostrarNuevoInsumo(false); }} insumosExistentes={insumos} darkMode={darkMode} colorMarca={colorMarca} />
            )}

            <div className={`${bgCard} p-8 rounded-[2.5rem] border ${darkMode ? 'border-gray-800' : 'border-[#D1D1CC]'} shadow-lg`}>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-flow-col lg:auto-cols-fr gap-6 items-end">
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Insumo</label>
                        <select name="insumo" value={movimiento.insumo} onChange={handleInputChange} className={inputClass} required>
                            <option value="">Elegir...</option>
                            {insumos.map(ins => <option key={ins.id} value={ins.id}>{ins.nombre} ({ins.stock_actual} {ins.unidad_medida})</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Tipo</label>
                        <select name="tipo" value={movimiento.tipo} onChange={handleInputChange} className={inputClass}>
                            <option value="S">Salida (-)</option><option value="E">Entrada (+)</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Cantidad</label>
                        <input type="number" step="0.01" name="cantidad" value={movimiento.cantidad} onChange={handleInputChange} className={inputClass} required />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[9px] font-black text-gray-500 mb-2 uppercase tracking-widest">Motivo</label>
                        <input type="text" name="motivo" value={movimiento.motivo} onChange={handleInputChange} className={inputClass} required />
                    </div>
                    <button type="submit" className="h-[52px] rounded-2xl font-black text-[10px] text-white tracking-widest" style={{ backgroundColor: colorMarca }}>EJECUTAR</button>
                </form>
            </div>
        </div>
    );
}

export default MovimientosInsumos;