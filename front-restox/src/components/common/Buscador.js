import React from 'react';

const Buscador = ({ busqueda, setBusqueda, categorias, categoriaSeleccionada, setCategoriaSeleccionada, darkMode, totalResultados, colorMarca }) => {
  return (
    <div className="mt-10 mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="🔍 Buscar insumo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full p-3 rounded-2xl border text-sm outline-none transition-all shadow-sm ${
              darkMode 
                ? "bg-[#25281D] border-gray-700 text-white" 
                : "bg-white border-gray-100"
            }`}
            style={{ borderBottomColor: busqueda ? colorMarca : '' }}
          />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {totalResultados} Resultados
        </p>
      </div>

      {/* Chips de Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategoriaSeleccionada(null)}
          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            !categoriaSeleccionada ? 'text-white border-transparent' : 'text-gray-400 border-gray-200'
          }`}
          style={{ backgroundColor: !categoriaSeleccionada ? colorMarca : 'transparent' }}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaSeleccionada(cat.id)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
              categoriaSeleccionada === cat.id ? 'text-white border-transparent' : 'text-gray-400 border-gray-200'
            }`}
            style={{ backgroundColor: categoriaSeleccionada === cat.id ? colorMarca : 'transparent' }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Buscador;