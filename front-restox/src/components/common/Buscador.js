import React from 'react';

/**
 * Componente Buscador optimizado para el nuevo Backend.
 * Permite filtrar por texto y por categorías obtenidas dinámicamente.
 */
const Buscador = ({ 
  busqueda, 
  setBusqueda, 
  categorias, 
  categoriaSeleccionada, 
  setCategoriaSeleccionada, 
  darkMode, 
  totalResultados, 
  colorMarca 
}) => {
  return (
    <div className="mt-10 mb-6 space-y-4">
      {/* Fila superior: Input de búsqueda y contador */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="🔍 Buscar insumo por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full p-3 rounded-2xl border text-sm outline-none transition-all shadow-sm ${
              darkMode 
                ? "bg-[#25281D] border-gray-700 text-white focus:border-opacity-50" 
                : "bg-white border-gray-100 focus:ring-1 focus:ring-gray-200"
            }`}
            style={{ borderBottomColor: busqueda ? colorMarca : '' }}
          />
        </div>
        
        {/* Contador de resultados dinámico */}
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          {totalResultados} {totalResultados === 1 ? 'Resultado' : 'Resultados'}
        </p>
      </div>

      {/* Chips de Categorías: Sincronizados con el modelo CategoriaInsumo del Backend */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setCategoriaSeleccionada(null)}
          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-200 ${
            !categoriaSeleccionada 
              ? 'text-white border-transparent' 
              : 'text-gray-400 border-gray-200 hover:border-gray-400'
          }`}
          style={{ 
            backgroundColor: !categoriaSeleccionada ? colorMarca : 'transparent' 
          }}
        >
          Todos
        </button>

        {categorias && categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaSeleccionada(cat.id)}
            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-200 ${
              categoriaSeleccionada === cat.id 
                ? 'text-white border-transparent' 
                : 'text-gray-400 border-gray-200 hover:border-gray-400'
            }`}
            style={{ 
              backgroundColor: categoriaSeleccionada === cat.id ? colorMarca : 'transparent' 
            }}
          >
            {cat.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Buscador;