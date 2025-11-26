// src/pages/InviteAccept.tsx
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authHeader } from "../api/helpers";

export default function InviteAccept() {
  const { token } = useContext(AuthContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const inviteToken = params.get("token");
  const [message, setMessage] = useState("Traitement...");

  useEffect(() => {
    let mounted = true;
    if (!inviteToken) {
      setMessage("Token manquant");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/invites/accept", {
          method: "POST",
          headers: authHeader(token, true),
          body: JSON.stringify({ token: inviteToken }),
        });
        const data = await res.json();
        if (!mounted) return;
        if (data.success) {
          setMessage("Invitation acceptée !");
          setTimeout(() => navigate(`/group/${data.groupId}`), 1000);
        } else {
          setMessage(data.error || "Erreur");
        }
      } catch (err: any) {
        if (!mounted) return;
        setMessage(err?.message || "Erreur");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [inviteToken, navigate, token]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4">Acceptation de l'invitation</h1>
      <p>{message}</p>
    </div>
  );
}
