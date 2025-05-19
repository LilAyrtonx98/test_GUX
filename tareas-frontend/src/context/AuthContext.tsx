'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        email,
        password,
      });

      const token = res.data.token;
      setToken(token);
      localStorage.setItem('token', token);

      const me = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(me.data);

      toast.success('Inicio de sesión exitoso');
      router.push('/tareas');
    } catch {
      toast.error('Credenciales inválidas');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        name,
        email,
        password,
      });

      const token = res.data.token;
      setToken(token);
      localStorage.setItem('token', token);

      const me = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(me.data);

      toast.success('Cuenta creada exitosamente');
      router.push('/tareas');
    } catch {
      toast.error('Error al crear cuenta');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Sesión cerrada');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
