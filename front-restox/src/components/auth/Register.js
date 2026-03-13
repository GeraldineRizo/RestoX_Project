import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const navigate = useNavigate();

  const isAllEmpty = Object.values(formData).every(val => val === '');
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setIsShaking(true);
      return;
    }
    setIsLoading(true);
    try {
      await api.post('register/', formData);
      navigate('/login');
    } catch (err) {
      setIsShaking(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#160821] relative overflow-hidden text-white font-sans">
      <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-[#672d91] rounded-full blur-[150px] opacity-20 animate-pulse z-0"></div>

      {/* Branding Izquierdo (Mismo tamaño text-[10rem] que Login) */}
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

      {/* Panel Derecho (33%) */}
      <div className="w-full lg:w-1/3 min-h-screen flex flex-col z-20">
        <div className="flex-1 bg-black/30 backdrop-blur-3xl border-l border-white/5 p-10 lg:p-14 flex flex-col justify-center items-center shadow-[-30px_0_100px_rgba(0,0,0,0.6)]">
          <div className={`w-full max-w-sm ${isShaking ? 'animate-shake' : ''} animate-slide-right`}>
            
            <header className="mb-8 w-full">
              <h2 className={`text-6xl font-brand italic tracking-tighter whitespace-nowrap transition-all duration-500 ${isAllEmpty ? 'text-[#f4ae17] drop-shadow-[0_0_20px_rgba(244,174,23,0.4)]' : 'text-white'}`}>
                Sign up
              </h2>
              <div className={`h-2 mt-2 rounded-full transition-all duration-500 ${isAllEmpty ? 'w-24 bg-[#f4ae17]' : 'w-12 bg-[#672d91]'}`}></div>
            </header>

            <form onSubmit={handleRegister} className="space-y-4">
              {['username', 'email', 'password', 'confirmPassword'].map((field) => (
                <div key={field} className="space-y-1.5 group">
                  <label className="text-[10px] font-black text-[#672d91] uppercase tracking-[0.3em] ml-2 group-focus-within:text-[#f4ae17]">{field}</label>
                  <input name={field} type={field.includes('password') ? 'password' : 'text'} className="w-full bg-[#160821]/80 border border-[#672d91]/30 rounded-2xl py-3 px-6 text-sm font-bold outline-none focus:border-[#f4ae17] text-white shadow-inner" placeholder={field} onChange={handleChange} required />
                </div>
              ))}

              <button type="submit" className="group relative w-full overflow-hidden rounded-2xl bg-[#f4ae17]/70 border border-[#f4ae17]/30 backdrop-blur-sm p-[1px] shadow-lg transition-all active:scale-[0.98] hover:bg-[#f4ae17]/80 mt-6">
                <div className="relative flex h-full items-center justify-center py-4">
                  <div className="absolute inset-0 z-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer"></div>
                  <span className="relative z-10 font-brand text-black uppercase text-xs tracking-[0.2em]">Crear Cuenta</span>
                </div>
              </button>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-[#672d91] text-[10px] uppercase tracking-widest font-black">
                ¿Ya eres parte? <span onClick={() => navigate('/login')} className="text-[#f4ae17] cursor-pointer hover:text-white transition-colors ml-2 underline underline-offset-4">Inicia sesión</span>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;