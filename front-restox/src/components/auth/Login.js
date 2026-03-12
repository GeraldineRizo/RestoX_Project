import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Cambiamos a /token/ que es el endpoint real en el backend
      const res = await api.post('token/', { 
        username, 
        password 
      });

      // 2. Guardamos los tokens en localStorage
      // SimpleJWT devuelve 'access' para el token de entrada
      localStorage.setItem('token', res.data.access); 
      localStorage.setItem('refresh', res.data.refresh);

      // 3. Redirigir al inventario o dashboard
      // Usamos navigate para no recargar toda la página innecesariamente
      navigate('/inventario'); 
      
    } catch (err) {
      console.error("Error en login:", err.response?.data);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c14]">
      <form 
        onSubmit={handleLogin} 
        className="bg-[#1C1F15] p-8 rounded-[2.5rem] shadow-xl border border-gray-800 w-96"
      >
        <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-tighter">
          RestoX Login
        </h2>
        
        {error && (
          <p className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-3 rounded-xl mb-4 text-center tracking-widest">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-500 mb-1 uppercase tracking-widest ml-2">Usuario</label>
            <input 
              type="text" 
              placeholder="Ej: admin" 
              className="bg-transparent border-b border-gray-700 p-3 text-xs outline-none focus:border-[#A3E635] transition-all text-white"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[9px] font-black text-gray-500 mb-1 uppercase tracking-widest ml-2">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="bg-transparent border-b border-gray-700 p-3 text-xs outline-none focus:border-[#A3E635] transition-all text-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-8 bg-[#A3E635] text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:opacity-90 transition-opacity shadow-lg"
        >
          Entrar al Sistema
        </button>
      </form>
    </div>
  );
};

export default Login;