// src/components/Tasks/TaskList.tsx
import React, {  useEffect, useState } from "react";
import { useTasks,   TaskType} from "../context/TasksContext";

export default function TaskList() {
  const { tasks, loading, refresh, addTask, updateTask, removeTask } = useTasks();

  // form states (local)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("todo");
  const [deadline, setDeadline] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    // refresh already called by provider on token change; keep optional
    // refresh();
  }, [refresh]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Titre requis");
    const payload: Partial<TaskType> = {
      title,
      description: desc || undefined,
      status,
      deadline: deadline || undefined,
    };
    const created = await addTask(payload);
    if (created) {
      setTitle("");
      setDesc("");

      setDeadline("");
      setStatus("todo");
    }
  };

  const startEdit = (t: TaskType) => {
    setEditing(t.id);
    setTitle(t.title);
    setDesc(t.description || "");
    setStatus(t.status || "todo");
    setDeadline(t.deadline ? t.deadline.split("T")[0] : "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setTitle("");
    setDesc("");
    setStatus("todo");
    setDeadline("");
  };

  const handleSave = async (id: string) => {
    const payload: Partial<TaskType> = {
      title,
      description: desc || undefined,
      status,
      deadline: deadline || undefined,
    };
    const updated = await updateTask(id, payload);
    if (updated) cancelEdit();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    await removeTask(id);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Vos tâches</h2>

      <form onSubmit={handleCreate} className="mb-6 p-4 border rounded bg-gray-50 space-y-3">
        <h3 className="text-lg font-semibold">Créer une nouvelle tâche</h3>
        <input className="w-full p-2 border rounded" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="w-full p-2 border rounded" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <div className="flex gap-3">
          <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">À faire</option>
            <option value="inprogress">En cours</option>
            <option value="done">Terminée</option>
          </select>
          <input type="date" className="p-2 border rounded" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">➕ Ajouter la tâche</button>
      </form>

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
              <div className="flex-1">
                {editing === t.id ? (
                  <div className="space-y-2">
                    <input className="w-full p-2 border" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea className="w-full p-2 border" value={desc} onChange={(e) => setDesc(e.target.value)} />
                    <div className="flex gap-2">
                      <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border">
                        <option value="todo">todo</option>
                        <option value="inprogress">inprogress</option>
                        <option value="done">done</option>
                      </select>
                      <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="p-2 border" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-semibold">{t.title}</div>
                    {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
                    {t.deadline && <div className="text-xs text-gray-400">Deadline: {new Date(t.deadline).toLocaleDateString()}</div>}
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {editing === t.id ? (
                  <>
                    <button onClick={() => handleSave(t.id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                    <button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(t)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
