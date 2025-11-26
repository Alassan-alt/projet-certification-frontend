import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../api/groups";

export default function GroupCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Le nom du groupe est obligatoire.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createGroup({ name, description });

      navigate("/dashboard"); // ✔ retour liste
    } catch (err: any) {
      setError("Erreur lors de la création du groupe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Créer un groupe</h1>

      {error && (
        <div className="bg-red-100 text-red-500 p-2 rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nom du groupe</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Groupe React"
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optionnelle)"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </div>
  );
}
