import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Sidebar from "./common/Sidebar";
import FormularioInsumos from "./inventario/FormularioInsumos";
import TablaInsumos from "./inventario/TablaInsumos";
import Buscador from "./common/Buscador";
import TarjetaInsumo from "./common/TarjetaInsumo";
import MovimientosInsumos from "./inventario/MovimientosInsumos";
import TablaMovimientos from "./inventario/TablaMovimientos";

const IconSettings = () => (
  <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

function Inventario() {
  // Estados de Preferencias Visuales (Sincronizados con BDD)
  const [modoOscuro, setModoOscuro] = useState(true);
  const [colorPrimario, setColorPrimario] = useState("#A3E635"); // Verde Lima por defecto
  const [colorSecundario, setColorSecundario] = useState("#2D3A26"); // Verde Arvi por defecto

  // Estados de Datos
  const [insumos, setInsumos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [negocio, setNegocio] = useState(null);
  
  // Estados de UI
  const [activeModule, setActiveModule] = useState('inventario');
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [vistaTabla, setVistaTabla] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Obtener información del negocio para configurar la marca
      const resNeg = await api.get('negocios/');
      const negocioActual = resNeg.data[0];
      setNegocio(negocioActual);

      if (negocioActual) {
        // Sincronizar UI con los campos de la base de datos [cite: 4]
        setModoOscuro(negocioActual.modo_oscuro);
        setColorPrimario(negocioActual.color_primario || "#A3E635");
        setColorSecundario(negocioActual.color_secundario || "#2D3A26");

        // 2. Carga paralela de datos operativos
        const [resIns, resMov, resCat] = await Promise.all([
          api.get(`insumos/?negocio=${negocioActual.id}`),
          api.get(`movimientos-inventario/?negocio=${negocioActual.id}`),
          api.get(`categorias/`)
        ]);

        setInsumos(resIns.data || []);
        setHistorial(resMov.data || []);
        setCategorias(resCat.data || []);
      }
      setCargando(false);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para cambiar el tema y persistirlo en el backend [cite: 4]
  const toggleDarkMode = async () => {
    const nuevoModo = !modoOscuro;
    setModoOscuro(nuevoModo);
    try {
      if (negocio?.id) {
        await api.patch(`negocios/${negocio.id}/`, { modo_oscuro: nuevoModo });
      }
    } catch (err) {
      console.error("Error al guardar preferencia de modo oscuro:", err);
    }
  };

  const insumosFiltrados = insumos.filter(insumo => {
    const cumpleBusqueda = insumo.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCategoria = categoriaSeleccionada ? insumo.categoria === categoriaSeleccionada : true;
    return cumpleBusqueda && cumpleCategoria;
  });

  if (cargando) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${modoOscuro ? 'bg-[#1a1c14]' : 'bg-gray-100'}`}>
        <div className={`${modoOscuro ? 'text-white' : 'text-gray-800'} font-black uppercase tracking-[0.5em] animate-pulse`}>
          Sincronizando Sistema...
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${modoOscuro ? 'bg-[#1a1c14] text-white' : 'bg-white text-zinc-900'}`}>
      
      {/* Sidebar dinámico que recibe el objeto negocio completo [cite: 4] */}
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        isDarkMode={modoOscuro}
        toggleDarkMode={toggleDarkMode}
        negocio={negocio}
        colorPrimario={colorPrimario}
        colorSecundario={colorSecundario}
      />

      <main className="flex-1 h-screen overflow-y-auto p-8">
        
        {/* MÓDULO: INVENTARIO */}
        {activeModule === 'inventario' && (
          <div className="space-y-10">
            <header className={`flex justify-between items-end border-b pb-4 ${modoOscuro ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: !modoOscuro ? colorSecundario : 'inherit' }}>
                  {negocio?.nombre || "SISTEMA DE GESTIÓN"}
                </h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Gestión de Stock</p>
              </div>
              <button 
                onClick={() => setVistaTabla(!vistaTabla)}
                className={`text-[10px] font-black uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${
                  modoOscuro ? 'border-zinc-700 hover:bg-white hover:text-black' : 'border-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                Vista: {vistaTabla ? "Tarjetas" : "Tabla"}
              </button>
            </header>

            <FormularioInsumos
              negocioId={negocio?.id}
              onInsumoAgregado={fetchData}
              insumosExistentes={insumos}
              darkMode={modoOscuro}
              colorMarca={colorPrimario}
            />

            <Buscador 
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              categorias={categorias}
              categoriaSeleccionada={categoriaSeleccionada}
              setCategoriaSeleccionada={setCategoriaSeleccionada}
              darkMode={modoOscuro}
              totalResultados={insumosFiltrados.length}
              colorMarca={colorPrimario}
            />

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">Stock en Tiempo Real</h3>
              {vistaTabla ? (
                <TablaInsumos insumos={insumosFiltrados} darkMode={modoOscuro} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {insumosFiltrados.map(insumo => (
                    <TarjetaInsumo 
                      key={insumo.id}
                      item={insumo}
                      darkMode={modoOscuro}
                      colorPrincipal={colorPrimario}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MÓDULO: MOVIMIENTOS */}
        {activeModule === 'movimientos' && (
          <div className="space-y-10">
            <header className={`border-b pb-4 ${modoOscuro ? 'border-zinc-800' : 'border-zinc-200'}`}>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Historial de Movimientos</h1>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Entradas y Salidas</p>
            </header>
            <MovimientosInsumos 
              insumos={insumos}
              negocioId={negocio?.id}
              onMovimientoRealizado={fetchData}
              darkMode={modoOscuro}
              colorMarca={colorPrimario}
            />
            <TablaMovimientos movimientos={historial} darkMode={modoOscuro} colorMarca={colorPrimario} />
          </div>
        )}

        {/* MÓDULO: AJUSTES */}
        {activeModule === 'ajustes' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="opacity-20 mb-4"><IconSettings /></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Panel de Configuración de {negocio?.nombre}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Inventario;