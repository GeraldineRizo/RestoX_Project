import React, { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import FormularioInsumos from "./components/FormularioInsumos";
import TablaMovimientos from "./components/TablaMovimientos";

function DashboardNegocio() {
  const { slug } = useParams();
  const [moduloActivo, setModuloActivo] = useState("inventario");
  const [darkMode, setDarkMode] = useState(false);
  const [negocio, setNegocio] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para el buscador
  const navigate = useNavigate();

  // Lógica de filtrado en tiempo real
  const insumosFiltrados = insumos.filter(item => 
    item.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cargarDatos = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const resNegocios = await axios.get(
        "http://127.0.0.1:8000/api/negocios/",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const found = resNegocios.data.find((n) => n.slug === slug);
      if (found) {
        setNegocio(found);
        const resInsumos = await axios.get(
          "http://127.0.0.1:8000/api/insumos/",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setInsumos(resInsumos.data);
      }
    } catch (err) {
      console.error("Error cargando datos", err);
    }
  }, [slug, navigate]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  if (!negocio)
    return (
      <div className="p-10 text-center font-black text-[#3C4623]">
        Cargando Arví...
      </div>
    );

  const themeClass = darkMode
    ? "bg-[#1A1C14] text-gray-100"
    : "bg-[#F9F7F2] text-gray-800";

  const cardClass = darkMode
    ? "bg-[#25281D] border-gray-700 shadow-none"
    : "bg-white border-gray-100 shadow-sm";

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${themeClass}`}>
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#3C4623] text-white p-6 flex flex-col shadow-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black tracking-tighter border-b border-white/10 pb-4">
            ARVÍ MENU
          </h2>
        </div>

        <nav className="flex-1 space-y-3">
          <button
            onClick={() => setModuloActivo("inventario")}
            className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${moduloActivo === "inventario" ? "bg-white/20" : "hover:bg-white/10 text-white/60"}`}
          >
            📦 Inventario
          </button>
          <button
            onClick={() => setModuloActivo("movimientos")}
            className={`w-full text-left p-4 rounded-2xl font-bold transition-all ${moduloActivo === "movimientos" ? "bg-white/20" : "hover:bg-white/10 text-white/60"}`}
          >
            📑 Movimientos
          </button>
        </nav>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center justify-center gap-2"
        >
          {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="p-4 text-red-300 font-bold hover:text-red-100 transition-colors text-sm text-center"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className={`text-3xl font-black uppercase ${darkMode ? "text-white" : "text-gray-800"}`}>
              {moduloActivo}
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              {negocio?.nombre_comercial} / Control Panel
            </p>
          </div>

          <div className={`${cardClass} p-4 rounded-2xl border text-right`}>
            <p className="text-[10px] font-black text-gray-400 uppercase">Valor de Bodega</p>
            <p className={`text-2xl font-black ${darkMode ? "text-green-400" : "text-[#3C4623]"}`}>
              ${insumos.reduce((acc, i) => acc + parseFloat(i.stock_actual) * parseFloat(i.precio_costo), 0).toLocaleString()}
            </p>
          </div>
        </header>

        {moduloActivo === "inventario" ? (
          <>
            <div className={`${darkMode ? "opacity-90" : ""}`}>
              <FormularioInsumos
                negocioId={negocio?.id}
                onInsumoAgregado={cargarDatos}
                insumosExistentes={insumos}
                darkMode={darkMode}
              />
            </div>

            {/* BUSCADOR INTEGRADO */}
            <div className="mt-10 mb-6 flex justify-between items-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="🔍 Buscar insumo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className={`w-full p-3 rounded-2xl border text-sm outline-none transition-all shadow-sm ${
                    darkMode 
                      ? "bg-[#25281D] border-gray-700 text-white focus:border-green-500" 
                      : "bg-white border-gray-100 focus:border-[#3C4623]"
                  }`}
                />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {insumosFiltrados.length} Insumos encontrados
              </p>
            </div>

            {/* GRID DE TARJETAS COMPACTAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {insumosFiltrados.map((item) => {
                const isLowStock = parseFloat(item.stock_actual) <= parseFloat(item.stock_minimo_alerta);
                return (
                  <div
                    key={item.id}
                    className={`${cardClass} group relative p-4 rounded-2xl border-l-4 transition-all hover:shadow-md hover:-translate-y-1`}
                    style={{ borderLeftColor: negocio?.color_principal || "#3C4623" }}
                  >
                    <div className="mb-3">
                      <h3 className={`text-sm font-black truncate ${darkMode ? "text-white" : "text-gray-800"}`} title={item.nombre}>
                        {item.nombre}
                      </h3>
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
                        <span className={`inline-block w-2 h-2 rounded-full ${isLowStock ? "bg-red-500 animate-ping" : "bg-green-500"}`} />
                        <p className={`text-[8px] font-black ml-1 inline-block ${isLowStock ? "text-red-500" : "text-gray-400"}`}>
                          {isLowStock ? "PEDIR" : "OK"}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-[#3C4623]/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-4">
                      <p className="text-[9px] font-bold uppercase opacity-80">Inversión Total</p>
                      <p className="text-lg font-black">
                        ${(parseFloat(item.stock_actual) * parseFloat(item.precio_costo)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-500">
            <header className="mb-6 flex justify-between items-end">
              <p className="text-gray-400 font-bold uppercase text-xs tracking-tighter">
                Historial de Auditoría
              </p>
            </header>
            <TablaMovimientos darkMode={darkMode} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/:slug" element={<DashboardNegocio />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}