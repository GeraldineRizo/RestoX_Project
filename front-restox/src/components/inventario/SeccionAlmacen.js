import React, { useState, useEffect } from "react";
import api from "../../api/axios";

// COMPONENTES OPERATIVOS
import FormularioInsumos from "./FormularioInsumos";
import Buscador from "../common/Buscador";
import TarjetaInsumo from "../common/TarjetaInsumo";

const SeccionAlmacen = ({ negocio, darkMode, colorMarca }) => {
    const [insumos, setInsumos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    const fetchDatosAlmacen = async () => {
        if (!negocio?.id) return;
        try {
            const [resIns, resCat] = await Promise.all([
                api.get(`insumos/?negocio=${negocio.id}`),
                api.get(`categorias/`)
            ]);
            setInsumos(resIns.data || []);
            setCategorias(resCat.data || []);
            setCargando(false);
        } catch (err) {
            console.error("Error cargando almacén:", err);
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchDatosAlmacen();
    }, [negocio]);

    // Lógica de filtrado
    const insumosFiltrados = insumos.filter(i => {
        const matchNombre = i.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const matchCat = categoriaSeleccionada ? i.categoria === categoriaSeleccionada : true;
        return matchNombre && matchCat;
    });

    if (cargando) return (
        <div className="p-10 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 animate-pulse">
                Cargando Insumos...
            </span>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className={`border-b pb-4 ${darkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Inventario</h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Gestión de Stock</p>
            </header>

            {/* FORMULARIO */}
            <FormularioInsumos 
                negocioId={negocio?.id} 
                onInsumoAgregado={fetchDatosAlmacen}
                darkMode={darkMode}
                colorMarca={colorMarca}
            />

            {/* BUSCADOR */}
            <Buscador 
                busqueda={busqueda} 
                setBusqueda={setBusqueda}
                categorias={categorias}
                categoriaSeleccionada={categoriaSeleccionada}
                setCategoriaSeleccionada={setCategoriaSeleccionada}
                darkMode={darkMode}
                totalResultados={insumosFiltrados.length}
                colorMarca={colorMarca}
            />

            {/* GRILLA DE PRODUCTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {insumosFiltrados.map(insumo => (
                    <TarjetaInsumo 
                        key={insumo.id} 
                        item={insumo} 
                        darkMode={darkMode} 
                        colorPrincipal={colorMarca} 
                    />
                ))}
            </div>

            {insumosFiltrados.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-zinc-500/10 rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                        No hay insumos que coincidan con la búsqueda
                    </p>
                </div>
            )}
        </div>
    );
};

export default SeccionAlmacen;