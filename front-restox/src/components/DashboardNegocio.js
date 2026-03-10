import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DashboardNegocio() {
  const { slug } = useParams(); // Esto lee el nombre de la URL
  const [negocio, setNegocio] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [salsaSeleccionada, setSalsaSeleccionada] = useState('');

  useEffect(() => {
    // 1. Buscamos la configuración del negocio (usando el slug)
    fetch(`http://localhost:8000/api/negocios/${slug}/`)
      .then(res => res.json())
      .then(data => {
        setNegocio(data);
        // 2. Una vez tenemos el negocio, buscamos sus insumos específicos
        return fetch(`http://localhost:8000/api/inventario/insumos/?negocio=${data.id}`);
      })
      .then(res => res.json())
      .then(data => setInsumos(data))
      .catch(err => console.error("Error cargando datos:", err));
  }, [slug]);

  if (!negocio) return <div className="p-10 text-center">Cargando configuración de {slug}...</div>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F9F7F2' }}>
      {/* Header Dinámico usando tus campos de modelos.py */}
      <header 
        style={{ backgroundColor: negocio.color_principal, color: negocio.color_secundario }}
        className="p-8 rounded-xl shadow-2xl mb-10 text-center transition-all duration-500"
      >
        <h1 className="text-4xl font-bold uppercase tracking-tighter">
          {negocio.nombre_comercial}
        </h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inventario Real filtrado */}
        <section className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderTopColor: negocio.color_principal }}>
          <h2 className="font-bold text-xl mb-4" style={{ color: negocio.color_principal }}>📦 INVENTARIO REAL ({negocio.moneda})</h2>
          <div className="space-y-3">
            {insumos.map(item => (
              <div key={item.id} className="flex justify-between border-b pb-2">
                <span>{item.nombre}</span>
                <span className="font-bold" style={{ color: item.stock < 5 ? 'red' : negocio.color_principal }}>
                  {item.stock} {item.unidad_medida}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Salsas (Paso 3 previo) */}
        <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: negocio.color_secundario }}>
          <h2 className="font-bold text-xl mb-4" style={{ color: negocio.color_principal }}>🍯 SALSAS ADICIONALES</h2>
          <div className="flex flex-wrap gap-3">
            {['Cheddar', 'Ranch', 'Ajo', 'Spicy'].map(salsa => (
              <button
                key={salsa}
                onClick={() => setSalsaSeleccionada(salsa)}
                className="px-4 py-2 rounded-full font-bold border transition-all"
                style={{ 
                  backgroundColor: salsaSeleccionada === salsa ? negocio.color_principal : 'white',
                  color: salsaSeleccionada === salsa ? negocio.color_secundario : negocio.color_principal,
                  borderColor: negocio.color_principal
                }}
              >
                {salsa}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardNegocio;