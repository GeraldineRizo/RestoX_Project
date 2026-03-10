import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
      localStorage.setItem('token', res.data.access); // Guardamos el pase de entrada
      localStorage.setItem('refresh', res.data.refresh);
      // Redirigir al dashboard genérico o al del negocio
      window.location.href = '/dashboard/arvi-coffee';
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-arvi-fondo">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-arvi-verde w-96">
        <h2 className="text-2xl font-bold text-arvi-verde mb-6 text-center">RestoX Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input 
          type="text" placeholder="Usuario" 
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña" 
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-arvi-verde text-arvi-crema py-2 rounded font-bold hover:opacity-90">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;