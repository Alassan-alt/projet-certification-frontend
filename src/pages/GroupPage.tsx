import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGroup, createInviteLink, removeMember } from "../api/groups";

export default function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<any>(null);
  const [inviteLink, setInviteLink] = useState("");

  const load = async () => {
    if (!id) return;
    const data = await getGroup(id);
    setGroup(data.group ?? data); 
  };

  useEffect(() => {
    load();
  }, [id]);

  const generateLink = async () => {
    if (!id) return;
    const res = await createInviteLink(id);
    setInviteLink(res.link);
  };

  const handleRemove = async (memberId: string) => {
    if (!id) return;
    await removeMember(id, memberId);
    load();
  };

  if (!group) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{group.name}</h1>

      <button
        className="mt-3 px-3 py-1 bg-indigo-600 text-white rounded"
        onClick={generateLink}
      >
        Générer un lien d'invitation
      </button>

      {inviteLink && (
        <div className="mt-3 p-3 bg-yellow-100 rounded">
          <div>Lien : {inviteLink}</div>
          <button
            className="mt-2 px-2 py-1 bg-gray-300 rounded"
            onClick={() => navigator.clipboard.writeText(inviteLink)}
          >
            Copier
          </button>
        </div>
      )}

      <h2 className="mt-6 text-xl font-semibold">Membres</h2>
      <ul className="mt-3 space-y-2">
        {group.memberIds?.map((m: string) => (
          <li
            key={m}
            className="p-2 bg-gray-50 rounded flex justify-between items-center"
          >
            {m}
            <button
              className="text-red-600"
              onClick={() => handleRemove(m)}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
