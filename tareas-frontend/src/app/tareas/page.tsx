'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';


interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'completada';
}

export default function TareasPage() {
  const { token, user, logout } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cargarTareas = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tareas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTareas(res.data);
    } catch {
      toast.error('Sesión inválida');
      logout();
    }
  };

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    cargarTareas();
  }, [token]);

  const crearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tareas`,
        { titulo, descripcion },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await cargarTareas();
      setTitulo('');
      setDescripcion('');
      toast.success('Tarea creada');
    } catch {
      toast.error('Error al crear tarea');
    } finally {
      setLoading(false);
    }
  };

  const eliminarTarea = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tareas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTareas(tareas.filter((t) => t.id !== id));
      toast.success('Tarea eliminada');
    } catch {
      toast.error('Error al eliminar tarea');
    }
  };

  const completarTarea = async (id: number) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tareas/${id}`,
        { estado: 'completada' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await cargarTareas();
      toast.success('Tarea completada');
    } catch {
      toast.error('Error al marcar como completada');
    }
  };

  const empezarEdicion = (tarea: Tarea) => {
    setEditandoId(tarea.id);
    setEditTitulo(tarea.titulo);
    setEditDescripcion(tarea.descripcion);
  };

  const guardarEdicion = async (id: number) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tareas/${id}`,
        { titulo: editTitulo, descripcion: editDescripcion },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await cargarTareas();
      setEditandoId(null);
      toast.success('Tarea actualizada');
    } catch {
      toast.error('Error al actualizar tarea');
    }
  };

  const tareasPendientes = tareas.filter((t) => t.estado === 'pendiente');
  const tareasCompletadas = tareas.filter((t) => t.estado === 'completada');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">¿Qué haremos hoy?, {user?.name || 'Usuario'} </h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Cerrar sesión
        </button>
      </div>
     <div className="mb-8 p-6 bg-white rounded-xl shadow border border-gray-200">
  <div className="flex items-center mb-4">
    <span className="text-blue-500 text-2xl mr-2">📝</span>
    <h2 className="text-xl font-bold">Crear nueva tarea</h2>
  </div>
  <form onSubmit={crearTarea} className="space-y-4">
    <input
      type="text"
      placeholder="Título"
      value={titulo}
      onChange={(e) => setTitulo(e.target.value)}
      className="w-full border p-2 rounded"
      required
    />
    <textarea
      placeholder="Descripción"
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      className="w-full border p-2 rounded"
    ></textarea>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Creando...' : 'Agregar Tarea'}
    </button>
  </form>
</div>


      {tareas.length === 0 && (
        <p className="text-center text-gray-500">No tienes tareas aún.</p>
      )}

      {tareasPendientes.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Tareas Pendientes</h2>
          <ul className="space-y-4">
            <AnimatePresence>
  {tareasPendientes.map((tarea) => (
    <motion.li
      key={tarea.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="border p-4 rounded bg-yellow-50"
    >
      {editandoId === tarea.id ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            value={editDescripcion}
            onChange={(e) => setEditDescripcion(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => guardarEdicion(tarea.id)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => setEditandoId(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">{tarea.titulo}</h3>
            <p className="text-sm text-gray-600">{tarea.descripcion}</p>
            <span className="text-xs text-yellow-800">Estado: pendiente</span>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <button
              onClick={() => empezarEdicion(tarea)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => completarTarea(tarea.id)}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              ✅ Completar
            </button>
            <button
              onClick={() => eliminarTarea(tarea.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              🗑 Eliminar
            </button>
          </div>
        </div>
      )}
    </motion.li>
  ))}
</AnimatePresence>

          </ul>
        </section>
      )}

      {tareasCompletadas.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Tareas Completadas</h2>
          <ul className="space-y-4">
            {tareasCompletadas.map((tarea) => (
              <li
                key={tarea.id}
                className="border p-4 rounded flex justify-between items-center bg-green-50"
              >
                <div>
                  <h3 className="font-bold line-through">{tarea.titulo}</h3>
                  <p className="text-sm text-gray-600 line-through">{tarea.descripcion}</p>
                  <span className="text-xs text-green-700">Estado: completada</span>
                </div>
                <button
                  onClick={() => eliminarTarea(tarea.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑 Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
