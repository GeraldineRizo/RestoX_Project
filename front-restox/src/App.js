import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

// --- ESTA ES LA VISTA QUE SE ADAPTA AL NEGOCIO ---
function DashboardNegocio() {
  const { slug } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [seleccionada, setSeleccionada] = useState('');
  const [cargando, setCargando] = useState(true);

  const salsas = ['Cheddar', 'Ranch', 'Ajo', 'Spicy'];

  useEffect(() => {
    setCargando(true);
    console.log("Buscando datos para el slug:", slug);

    // Intentamos obtener todos los negocios y filtrar el que coincida con el slug
    fetch('http://localhost:8000/api/negocios/')
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos de la API:", data);
        
        // Buscamos el negocio cuyo slug coincida con el de la URL
        // Si tu modelo en Django no tiene campo 'slug', puedes probar con 'nombre_comercial'
        const found = data.find(n => n.slug === slug || n.nombre_comercial?.toLowerCase().replace(/\s+/g, '-') === slug);

        if (found) {
          setNegocio(found);
          // 2. Buscamos sus insumos usando el ID encontrado
          return fetch(`http://localhost:8000/api/insumos/?negocio=${found.id}`);
        } else {
          throw new Error("No se encontró un negocio que coincida con este slug");
        }
      })
      .then(res => res.json())
      .then(data => {
        setInsumos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error en la carga:", err.message);
        setNegocio(null);
        setCargando(false);
      });
  }, [slug]);

  if (cargando) return <div className="p-10 text-center">Conectando con RestoX...</div>;
  
  if (!negocio) return (
    <div className="p-10 text-center">
      <h2 className="text-red-500 font-bold text-2xl">Negocio no encontrado</h2>
      <p className="text-gray-500">No hay registros para: <span className="font-mono bg-gray-200 px-2">{slug}</span></p>
      <p className="text-sm mt-4 text-gray-400 italic">Revisa la consola (F12) para ver los datos de la API.</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F9F7F2' }}>
      <header 
        style={{ backgroundColor: negocio.color_principal, color: negocio.color_secundario }}
        className="p-8 rounded-xl shadow-2xl mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tighter uppercase">{negocio.nombre_comercial}</h1>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md border-t-4" style={{ borderTopColor: negocio.color_principal }}>
          <h2 className="font-bold text-xl mb-4" style={{ color: negocio.color_principal }}>📦 INVENTARIO REAL</h2>
          <div className="space-y-3">
            {insumos.length > 0 ? (
              insumos.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-2">
                  <span className="font-medium">{item.nombre}</span>
                  <span className="font-bold" style={{ color: item.stock < 5 ? 'red' : negocio.color_principal }}>
                    {item.stock} {item.unidad_medida}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No hay insumos cargados.</p>
            )}
          </div>
        </section>

        <section className="p-6 rounded-lg shadow-md" style={{ backgroundColor: negocio.color_secundario }}>
          <h2 className="font-bold text-xl mb-4" style={{ color: negocio.color_principal }}>🍯 SALSAS ADICIONALES</h2>
          <div className="flex flex-wrap gap-4">
            {salsas.map(salsa => (
              <button
                key={salsa}
                onClick={() => setSeleccionada(salsa)}
                className="px-6 py-2 rounded-full font-bold border transition-all"
                style={{ 
                  backgroundColor: seleccionada === salsa ? negocio.color_principal : 'white',
                  color: seleccionada === salsa ? negocio.color_secundario : negocio.color_principal,
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

function App() {
  return (
    <Routes>
      <Route path="/:slug" element={<DashboardNegocio />} />
      <Route path="/" element={<div className="p-10 text-center">Selecciona un local (ej: /arvi-coffee)</div>} />
    </Routes>
  );
}

export default App;