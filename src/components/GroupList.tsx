// src/components/Groups/GroupList.tsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authHeader } from "../api/helpers";

type Group = { id: string; name: string; description?: string };

export default function GroupList() {
  const { token } = useContext(AuthContext);
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/groups", { headers: authHeader(token, false) });
      const json = await res.json();
      setGroups(json || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: authHeader(token, true),
        body: JSON.stringify({ name, description: "" }),
      });
      const g = await res.json();
      setGroups((s) => [g, ...s]);
      setName("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Vos groupes</h2>

      <form onSubmit={createGroup} className="mb-4 flex gap-2">
        <input className="flex-1 p-2 border rounded" placeholder="Nouveau groupe" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Créer</button>
      </form>

      {loading ? <div>Chargement...</div> : (
        <ul className="space-y-2">
          {groups.map((g) => (
            <li key={g.id}>
              <Link to={`/group/${g.id}`} className="block p-3 bg-gray-50 hover:bg-gray-100 rounded">
                <div className="font-semibold">{g.name}</div>
                <div className="text-sm text-gray-500">{g.description}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
