import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FormularioInsumo from './FormularioInsumo'; // Asegúrate de que el nombre coincida

function DashboardNegocio() {
  const { slug } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [error, setError] = useState(null);

  // Usamos useCallback para poder llamar a esta función desde el Formulario
  const cargarDatos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setError("No hay sesión activa");
        return;
    }

    try {
      // 1. Cargamos los negocios para encontrar el que coincide con el slug
      const resNegocios = await axios.get('http://127.0.0.1:8000/api/negocios/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const found = resNegocios.data.find(n => n.slug === slug);
      
      if (found) {
        setNegocio(found);
        // 2. Cargamos los insumos (Django ya los filtra por usuario en el backend)
        const resInsumos = await axios.get('http://127.0.0.1:8000/api/insumos/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInsumos(resInsumos.data);
      } else {
        setError(`No se encontró el negocio: ${slug}`);
      }
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error de conexión con el servidor");
    }
  }, [slug]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;
  if (!negocio) return <div className="p-10 text-center font-medium text-gray-500">Cargando panel de {slug}...</div>;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F9F7F2' }}>
      
      {/* Header con el estilo de Arví */}
      <header className="bg-white p-8 rounded-2xl shadow-sm mb-10 flex justify-between items-center border-l-8" 
              style={{ borderLeftColor: negocio.color_principal || '#3C4623' }}>
        <div>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
            {negocio.nombre_comercial}
          </h1>
          <p className="text-gray-400 font-bold text-sm">Panel de Control / {slug}</p>
        </div>
        {negocio.logo && (
          <img src={negocio.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg" />
        )}
      </header>

      <div className="max-w-6xl mx-auto">
        
        {/* Formulario para agregar nuevos productos */}
        <h2 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Registrar Nuevo Insumo</h2>
        <FormularioInsumo 
          negocioId={negocio.id} 
          onInsumoAgregado={cargarDatos} 
        />

        {/* Listado de Insumos en tarjetas modernas */}
        <h2 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">Inventario Actual</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insumos.length > 0 ? (
            insumos.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.nombre}</h3>
                    <span className="text-xs text-gray-400 font-bold uppercase">{item.categoria_nombre || 'General'}</span>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold">ID: {item.id}</span>
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{item.stock_actual}</span>
                  <span className="text-gray-400 font-bold mb-1 uppercase text-xs">{item.unidad_medida}</span>
                </div>

                {/* Alerta de reabastecimiento */}
                {parseFloat(item.stock_actual) <= 5 && (
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                    <button className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      Reabastecer urgente
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium">
              No hay insumos registrados para este negocio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardNegocio;