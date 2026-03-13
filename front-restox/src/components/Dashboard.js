import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";

// COMPONENTES
import Sidebar from "./common/Sidebar";
import SeccionAlmacen from "./inventario/SeccionAlmacen"; 
import SeccionMovimientos from "./SeccionMovimientos";
import PerfilNegocio from "./configuracion/PerfilNegocio";
import Parametrizacion from "./configuracion/Parametrizacion";

const Dashboard = () => {
    // ESTADOS CONCENTRADOS
    const [config, setConfig] = useState({
        negocio: null,
        modoOscuro: true,
        colorPrimario: "#A3E635",
        cargando: true,
        error: null
    });
    
    const [activeModule, setActiveModule] = useState('inventario');

    // 1. MEMOIZACIÓN DE COLORES Y ESTILOS (Evita recálculos en cada render)
    const themeStyles = useMemo(() => ({
        bg: config.modoOscuro ? 'bg-[#14160F] text-white' : 'bg-[#F4F4F1] text-zinc-900',
        border: config.modoOscuro ? 'border-zinc-800' : 'border-zinc-200',
        loaderBg: config.modoOscuro ? 'bg-[#14160F]' : 'bg-white'
    }), [config.modoOscuro]);

    // 2. FUNCIÓN DE CARGA OPTIMIZADA (Uso de useCallback para evitar recrear la función)
    const fetchConfiguracion = useCallback(async () => {
        try {
            setConfig(prev => ({ ...prev, cargando: true, error: null }));
            const { data } = await api.get('negocios/');
            
            if (data?.length > 0) {
                const n = data[0];
                setConfig({
                    negocio: n,
                    modoOscuro: n.modo_oscuro,
                    colorPrimario: n.color_primario || "#A3E635",
                    cargando: false,
                    error: null
                });
            } else {
                throw new Error("No se encontró ningún negocio registrado.");
            }
        } catch (err) {
            setConfig(prev => ({ 
                ...prev, 
                cargando: false, 
                error: "Error de conexión con el servidor o base de datos vacía." 
            }));
        }
    }, []);

    useEffect(() => {
        fetchConfiguracion();
    }, [fetchConfiguracion]);

    // 3. RENDERIZADO CONDICIONAL DE MÓDULOS (Optimización de legibilidad)
    const renderModule = () => {
        const props = { 
            negocio: config.negocio, 
            darkMode: config.modoOscuro, 
            colorMarca: config.colorPrimario 
        };

        switch (activeModule) {
            case 'inventario': return <SeccionAlmacen {...props} />;
            case 'movimientos': return <SeccionMovimientos {...props} />;
            case 'ajustes': return (
                <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    <header className={`border-b pb-4 ${themeStyles.border}`}>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Ajustes</h1>
                    </header>
                    <PerfilNegocio {...props} onActualizar={fetchConfiguracion} />
                    <Parametrizacion {...props} onActualizarCategorias={fetchConfiguracion} />
                </div>
            );
            default: return <SeccionAlmacen {...props} />;
        }
    };

    // PANTALLA DE ERROR
    if (config.error) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#14160F] text-white p-10">
            <div className="text-red-500 text-4xl mb-4 italic font-black">!</div>
            <h2 className="text-xl font-black uppercase mb-2">Error de Sistema</h2>
            <p className="text-zinc-500 text-sm mb-6">{config.error}</p>
            <button onClick={fetchConfiguracion} className="px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest bg-white text-black transition-transform active:scale-95">
                Reintentar
            </button>
        </div>
    );

    // PANTALLA DE CARGA
    if (config.cargando) return (
        <div className={`h-screen flex items-center justify-center ${themeStyles.loaderBg}`}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-t-transparent border-zinc-500 rounded-full animate-spin" />
                <span className="font-black uppercase tracking-[0.4em] text-[9px] text-zinc-500 animate-pulse">Sincronizando RestoX...</span>
            </div>
        </div>
    );

    return (
        <div className={`flex min-h-screen ${themeStyles.bg} transition-colors duration-500`}>
            <Sidebar 
                activeModule={activeModule} 
                setActiveModule={setActiveModule}
                negocio={config.negocio}
                isDarkMode={config.modoOscuro}
                colorPrimario={config.colorPrimario}
            />

            <main className="flex-1 p-4 lg:p-10 ml-20 lg:ml-64 overflow-y-auto h-screen scroll-smooth">
                {renderModule()}
            </main>
        </div>
    );
};

export default Dashboard;