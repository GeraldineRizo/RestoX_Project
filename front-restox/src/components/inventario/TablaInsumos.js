import React from 'react';

const TablaInsumos = ({ insumos, darkMode }) => {
    const tableClass = darkMode ? "text-white" : "text-gray-800";
    const rowClass = darkMode ? "border-zinc-800 hover:bg-zinc-800/50" : "border-gray-100 hover:bg-gray-50";

    return (
        <div className={`overflow-x-auto rounded-2xl border ${darkMode ? 'border-zinc-800 bg-[#25281D]' : 'border-gray-100 bg-white shadow-sm'}`}>
            <table className={`w-full text-left text-xs ${tableClass}`}>
                <thead className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                    <tr>
                        <th className="px-6 py-4">Insumo</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4 text-right">Stock</th>
                        <th className="px-6 py-4 text-right">Costo Unit.</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {insumos.map((insumo) => {
                        // Comparamos stock_actual con stock_minimo (nombres de tu modelo Django)
                        const esBajoStock = parseFloat(insumo.stock_actual) <= parseFloat(insumo.stock_minimo);
                        
                        return (
                            <tr key={insumo.id} className={`transition-colors ${rowClass}`}>
                                <td className="px-6 py-4 font-medium">{insumo.nombre}</td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {insumo.categoria_nombre || 'General'}
                                </td>
                                <td className="px-6 py-4 text-right font-mono">
                                    {insumo.stock_actual} <span className="text-[10px]">{insumo.unidad_medida}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono">
                                    ${parseFloat(insumo.precio_costo_actual).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
                                        esBajoStock ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                    }`}>
                                        {esBajoStock ? 'Bajo Stock' : 'Ok'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {insumos.length === 0 && (
                <div className="p-10 text-center text-zinc-500 text-xs italic">
                    Esperando datos del servidor...
                </div>
            )}
        </div>
    );
};

export default TablaInsumos;