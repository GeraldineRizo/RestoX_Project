import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// IMPORTACIONES DE MÓDULOS
import FormularioInsumos from "../inventario/FormularioInsumos";
import Parametrizacion from "../../modules/configuracion/Parametrizacion";
import TarjetaInsumo from "../common/TarjetaInsumo";
import Buscador from "../common/Buscador";
import SeccionMovimientos from "../SeccionMovimientos";

function DashboardBase() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [moduloActivo, setModuloActivo] = useState("inventario");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarAbierta, setSidebarAbierta] = useState(true);
  const [negocio, setNegocio] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoInterfaz, setCargandoInterfaz] = useState(true); 
  const [cargandoDatosFondo, setCargandoDatosFondo] = useState(false);

  const insumosFiltrados = useMemo(() => {
    return insumos.filter(item => {
      const coincideNombre = item.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoriaSeleccionada ? item.categoria === parseInt(categoriaSeleccionada) : true;
      return coincideNombre && coincideCategoria;
    });
  }, [insumos, busqueda, categoriaSeleccionada]);

  const cargarConfiguracionInicial = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      const resNegocios = await axios.get("http://127.0.0.1:8000/api/negocios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const found = resNegocios.data.find((n) => n.slug === slug);
      if (found) {
        setNegocio(found);
        setCargandoInterfaz(false);
        fetchDatosPesados(found.id, token);
      }
    } catch (err) {
      setCargandoInterfaz(false);
    }
  }, [slug, navigate]);

  const fetchDatosPesados = async (negocioId, token) => {
    setCargandoDatosFondo(true);
    try {
      const [resInsumos, resCats] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/insumos/?negocio=${negocioId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://127.0.0.1:8000/api/categorias/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setInsumos(resInsumos.data);
      setCategorias(resCats.data);
    } catch (err) { console.error(err); } finally { setCargandoDatosFondo(false); }
  };

  useEffect(() => { cargarConfiguracionInicial(); }, [cargarConfiguracionInicial]);

  if (cargandoInterfaz) return <div className="h-screen w-full flex items-center justify-center font-black text-gray-400 uppercase animate-pulse">Cargando RestoX...</div>;

  const colorMarca = negocio?.color_principal || "#3C4623";
  const themeClass = darkMode ? "bg-[#14160F] text-gray-100" : "bg-[#F4F4F1] text-gray-800";
  const cardClass = darkMode ? "bg-[#1C1F15] border-gray-800" : "bg-white border-gray-100 shadow-sm";

  return (
    <div className={`flex min-h-screen transition-all duration-500 ${themeClass}`}>
      <aside 
        className={`fixed left-0 top-0 h-full z-50 transition-all duration-500 ease-in-out flex flex-col shadow-2xl ${sidebarAbierta ? 'w-64' : 'w-20'}`}
        style={{ backgroundColor: colorMarca }}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10 h-24">
          {sidebarAbierta && <h2 className="text-xl font-black tracking-tighter uppercase text-white truncate">{negocio?.nombre_comercial}</h2>}
          <button onClick={() => setSidebarAbierta(!sidebarAbierta)} className="p-2 hover:bg-white/10 rounded-xl text-white mx-auto">
            {sidebarAbierta ? '✕' : '☰'}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'inventario', icon: '📦', label: 'Inventario' },
            { id: 'movimientos', icon: '📑', label: 'Movimientos' },
            { id: 'configuracion', icon: '⚙️', label: 'Ajustes' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setModuloActivo(item.id)}
              className={`w-full flex items-center p-4 rounded-2xl font-bold transition-all ${moduloActivo === item.id ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10'}`}
              style={moduloActivo === item.id ? { color: colorMarca } : {}}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarAbierta && <span className="ml-4 text-sm uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => setDarkMode(!darkMode)} className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase text-white">
            {sidebarAbierta ? (darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro") : (darkMode ? "☀️" : "🌙")}
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-8 transition-all duration-500 ${sidebarAbierta ? 'ml-64' : 'ml-20'}`}>
        <header className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">{moduloActivo}</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] mt-2">Arví / RestoX v2.0</p>
        </header>

        {moduloActivo === "inventario" ? (
          <div className="space-y-6">
            <FormularioInsumos negocioId={negocio?.id} onInsumoAgregado={() => fetchDatosPesados(negocio.id, localStorage.getItem("token"))} insumosExistentes={insumos} darkMode={darkMode} colorMarca={colorMarca} />
            <Buscador busqueda={busqueda} setBusqueda={setBusqueda} categorias={categorias} categoriaSeleccionada={categoriaSeleccionada} setCategoriaSeleccionada={setCategoriaSeleccionada} darkMode={darkMode} totalResultados={insumosFiltrados.length} colorMarca={colorMarca} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {insumosFiltrados.map((item) => <TarjetaInsumo key={item.id} item={item} colorPrincipal={colorMarca} darkMode={darkMode} cardClass={cardClass} />)}
            </div>
          </div>
        ) : moduloActivo === "movimientos" ? (
          <SeccionMovimientos darkMode={darkMode} colorMarca={colorMarca} /> 
        ) : (
          <Parametrizacion darkMode={darkMode} colorMarca={colorMarca} />
        )}
      </main>
    </div>
  );
}
export default DashboardBase;