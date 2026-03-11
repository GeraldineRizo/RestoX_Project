import React, { useState, useEffect } from "react";
import axios from "axios";
import FormularioInsumos from "./inventario/FormularioInsumos";

import TablaInsumos from "./inventario/TablaInsumos";


const API_BASE_URL = "http://127.0.0.1:8000/api";

function Inventario() {
  const [insumos, setInsumos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [negocio, setNegocio] = useState(null);
  const [cargando, setCargando] = useState(true);

  const darkMode = true;
  const colorMarca = "#A3E635";

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Obtenemos el negocio primero para tener el ID
      const resNeg = await axios.get(`${API_BASE_URL}/negocios/`, { headers });
      const negocioActual = resNeg.data[0];
      setNegocio(negocioActual);

      if (negocioActual) {
        // Cargamos insumos y movimientos usando el ID del negocio
        const [resIns, resMov] = await Promise.all([
          axios.get(`${API_BASE_URL}/insumos/?negocio=${negocioActual.id}`, {
            headers,
          }),
          axios.get(
            `${API_BASE_URL}/movimientos/?negocio=${negocioActual.id}`,
            { headers },
          ),
        ]);

        setInsumos(resIns.data || []);
        setHistorial(resMov.data || []);
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

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#1a1c14] flex items-center justify-center">
        <div className="text-white text-center font-black uppercase tracking-[0.5em] animate-pulse">
          Sincronizando Sistema...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1c14] text-white p-6 space-y-10">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {negocio?.nombre || "ARVÍ"}
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            PLATAFORMA RESTOX / V2.0
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <FormularioInsumos
          negocioId={negocio?.id}
          onInsumoAgregado={fetchData}
          insumosExistentes={insumos}
          darkMode={darkMode}
          colorMarca={colorMarca}
        />

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
            Stock Actual
          </h3>
          <TablaInsumos
            insumos={insumos}
            darkMode={darkMode}
            colorMarca={colorMarca}
          />
        </div>
      </div>
    </div>
  );
}

export default Inventario;
