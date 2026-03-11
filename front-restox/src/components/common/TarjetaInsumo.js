import React from 'react';

// Ahora el componente es genérico: recibe los datos y los estilos sin saber de qué negocio son
const TarjetaInsumo = ({ item, colorPrincipal, darkMode, cardClass }) => {
  // Lógica de stock mínimo (se mantiene igual pero usa props)
  const isLowStock = parseFloat(item.stock_actual) <= parseFloat(item.stock_minimo_alerta);

  return (
    <div
      className={`${cardClass} group relative p-4 rounded-2xl border-l-4 transition-all hover:shadow-md hover:-translate-y-1`}
      // USABILIDAD X: El color de la banda lateral ahora viene de la base de datos del negocio logueado
      style={{ borderLeftColor: colorPrincipal || "#3C4623" }} 
    >
      <div className="mb-3">
        <h3 className={`text-sm font-black truncate ${darkMode ? "text-white" : "text-gray-800"}`} title={item.nombre}>
          {item.nombre}
        </h3>
        {/* Categoría dinámica */}
        <span className="text-[9px] font-bold text-blue-500/80 uppercase tracking-tighter">
          {item.categoria_nombre || "General"}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span className={`text-xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>
          {item.stock_actual}
        </span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          {item.unidad_medida}
        </span>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-50/10">
        <div>
          <p className="text-[8px] font-bold text-gray-400 uppercase">Costo Unit.</p>
          <p className="text-xs font-black text-green-500">${item.precio_costo}</p>
        </div>
        <div className="text-right">
          {/* Alerta visual dinámica */}
          <span className={`inline-block w-2 h-2 rounded-full ${isLowStock ? "bg-red-500 animate-ping" : "bg-green-500"}`} />
          <p className={`text-[8px] font-black ml-1 inline-block ${isLowStock ? "text-red-500" : "text-gray-400"}`}>
            {isLowStock ? "PEDIR" : "OK"}
          </p>
        </div>
      </div>

      {/* OVERLAY DE INVERSIÓN: Adaptable al color del negocio */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-4"
        style={{ backgroundColor: `${colorPrincipal || "#3C4623"}E6` }} // Color del negocio con 90% de opacidad (E6 en hex)
      >
        <p className="text-[9px] font-bold uppercase opacity-80">Inversión Total</p>
        <p className="text-lg font-black">
          ${(parseFloat(item.stock_actual) * parseFloat(item.precio_costo)).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default TarjetaInsumo;