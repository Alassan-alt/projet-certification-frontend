import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTasks } from "../context/TasksContext";


interface Group {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  groupId?: string;
}

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const { task } = useTasks();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:4000/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups || []);
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Vous devez vous connecter</h1>
        <Link
          to="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Aller au login
        </Link>
      </div>
    );
  }

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Chargement...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* WELCOME */}
      <h1 className="text-3xl font-bold mb-4">
        Bienvenue <span className="text-blue-600">{user?.name}</span> 👋
      </h1>

      {/* SECTION GROUPES */}
      <div className="mt-8 bg-white shadow-md rounded-xl p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vos groupes</h2>

          <button
            onClick={() => navigate("/group/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Créer un groupe
          </button>
        </div>

        {groups.length === 0 ? (
          <p className="text-gray-500">Aucun groupe pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((g) => (
              <Link
                key={g.id}
                to={`/group/${g.id}`}
                className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {g.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SECTION TASKS */}
      <div className="mt-8 bg-white shadow-md rounded-xl p-6 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Vos tâches</h2>

          <button
            onClick={() => navigate("/task/create")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            ➕ Créer une tâche
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-gray-500">Vous n'avez pas encore de tâches.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tasks.map((t) => (
              <Link
                key={t.id}
                to={`/task/${t.id}`}
                className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                {t.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
