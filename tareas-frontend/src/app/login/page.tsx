'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validarCampos = () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      toast.error('Correo electrónico inválido');
      return false;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCampos()) return;

    setLoading(true);
    const loadingToast = toast.loading('Ingresando...');

    try {
      await login(email, password);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Credenciales inválidas');
      } else if (err.response?.status === 422) {
        const errores = err.response.data;
        Object.values(errores).forEach((mensajes: any) => {
          toast.error(mensajes[0]);
        });
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="text-sm text-center">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-teal-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}
