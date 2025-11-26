import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

export type TaskType = {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
};

type TaskContextType = {
  tasks: TaskType[];
  loading: boolean;
  refresh: () => Promise<void>;
  addTask: (t: Partial<TaskType>) => Promise<TaskType | null>;
  updateTask: (id: string, t: Partial<TaskType>) => Promise<TaskType | null>;
  removeTask: (id: string) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger toutes les tâches
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Erreur chargement tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // Ajouter une tâche
  const addTask = async (payload: Partial<TaskType>) => {
    try {
      const res = await api.post("/api/tasks", payload);
      setTasks((t) => [res.data, ...t]);
      return res.data;
    } catch (err) {
      console.error("Erreur addTask", err);
      return null;
    }
  };

  // Modifier une tâche
  const updateTask = async (id: string, payload: Partial<TaskType>) => {
    try {
      const res = await api.put(`/api/tasks/${id}`, payload);
      setTasks((t) => t.map(task => task.id === id ? res.data : task));
      return res.data;
    } catch (err) {
      console.error("Erreur updateTask", err);
      return null;
    }
  };

  // Supprimer une tâche
  const removeTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks((t) => t.filter(task => task.id !== id));
    } catch (err) {
      console.error("Erreur removeTask", err);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, refresh, addTask, updateTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside <TaskProvider>");
  return ctx;
};
