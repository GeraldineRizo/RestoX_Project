import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// IMPORTACIONES LIMPIAS (Solo las necesarias para las rutas)
import Login from "./components/auth/Login";
import DashboardBase from "./components/layout/DashboardBase";
import SeccionMovimientos from "./components/SeccionMovimientos";

function App() {
  return (
    <Routes>
      {/* 1. Al entrar a la raíz, redirigir al Login automáticamente */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 2. Pantalla de inicio de sesión */}
      <Route path="/login" element={<Login />} />
      
      {/* 3. El Dashboard dinámico que carga cualquier negocio por su slug */}
      <Route path="/dashboard/:slug" element={<DashboardBase />} />
      
      {/* 4. Si el usuario escribe cualquier otra cosa, mandarlo al login */}
      <Route path="*" element={<Navigate to="/login" />} />
      {/* 5. Ruta específica para movimientos (si es que se necesita una sección aparte) */}
      <Route path="/movimientos" element={<SeccionMovimientos />} />
    </Routes>
  );
}

export default App;