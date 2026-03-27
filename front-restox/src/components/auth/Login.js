import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Necesitarás instalar esta librería: npm install jwt-decode

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const isFormEmpty = !username && !password;

  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Llamamos a nuestro endpoint personalizado configurado en urls.py
      const res = await api.post('login/', { username, password });
      
      const { access, refresh } = res.data;

      // Decodificamos el token para obtener info del usuario/negocio sin hacer otro fetch
      const decoded = jwtDecode(access);
      
      // Guardamos la sesión
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user_data', JSON.stringify({
        username: decoded.username,
        rol: decoded.rol,
        negocio_id: decoded.negocio_id
      }));

      // Redirección basada en rol (Ejemplo de lógica Senior)
      if (decoded.rol === 'Admin_SaaS') {
        navigate('/admin-panel'); 
      } else {
        navigate('/inventario');
      }

    } catch (err) {
      setIsShaking(true);
      setError(err.response?.data?.detail || 'Error de conexión con el servidor');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#160821] relative overflow-hidden text-white font-sans">
      
      {/* Luces de fondo */}
      <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-[#672d91] rounded-full blur-[150px] opacity-20 animate-pulse z-0"></div>

      {/* Branding Izquierdo */}
      <div className="hidden lg:flex lg:w-2/3 relative items-center justify-center z-10">
        <div className="text-center">
           <h1 className="text-[10rem] font-brand tracking-tighter leading-none select-none">
             Resto<span className="text-[#f4ae17]">X</span>
           </h1>
           <p className="text-[#672d91] text-[10px] uppercase tracking-[1.5em] font-black opacity-70 ml-4">
             Future of Management
           </p>
        </div>
      </div>

      {/* Panel Derecho */}
      <div className="w-full lg:w-1/3 min-h-screen flex flex-col z-20">
        <div className="flex-1 bg-black/30 backdrop-blur-3xl border-l border-white/5 p-10 lg:p-16 flex flex-col justify-center items-center shadow-[-30px_0_100px_rgba(0,0,0,0.6)]">
          
          <div className={`w-full max-w-sm ${isShaking ? 'animate-shake' : ''} animate-slide-right`}>
            
            <header className="mb-12 w-full">
              <h2 className={`text-6xl font-brand italic tracking-tighter whitespace-nowrap transition-all duration-700 ${
                isFormEmpty ? 'text-[#f4ae17] drop-shadow-[0_0_15px_rgba(244,174,23,0.4)]' : 'text-white'
              }`}>
                Sign in
              </h2>
              {error && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-widest">{error}</p>}
            </header>

            <form onSubmit={handleLogin} className="space-y-7">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-[#672d91] uppercase tracking-[0.3em] ml-2 group-focus-within:text-[#f4ae17] transition-colors">Usuario</label>
                <input type="text" className="w-full bg-[#160821]/80 border border-[#672d91]/30 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#f4ae17] text-white shadow-inner" placeholder="admin.access" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-[#672d91] uppercase tracking-[0.3em] ml-2 group-focus-within:text-[#f4ae17] transition-colors">Contraseña</label>
                <input type="password" className="w-full bg-[#160821]/80 border border-[#672d91]/30 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#f4ae17] text-white shadow-inner" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" disabled={isLoading} className="group relative w-full overflow-hidden rounded-2xl bg-[#f4ae17]/70 border border-[#f4ae17]/30 backdrop-blur-sm p-[1px] shadow-lg transition-all active:scale-[0.98] hover:bg-[#f4ae17]/80 mt-4">
                <div className="relative flex h-full items-center justify-center py-4">
                  <div className="absolute inset-0 z-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer"></div>
                  <span className="relative z-10 font-brand text-black uppercase text-xs tracking-[0.2em]">{isLoading ? '...' : 'Ingresar'}</span>
                </div>
              </button>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-[#672d91] text-[10px] uppercase tracking-widest font-black">
                ¿No tienes cuenta? <span onClick={() => navigate('/register')} className="text-[#f4ae17] cursor-pointer hover:text-white transition-colors ml-2 underline underline-offset-4">Regístrate</span>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;