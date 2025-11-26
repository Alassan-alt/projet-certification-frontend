// src/api/groups.ts
import { api } from "./axios"

// 🔹 Liste des groupes
export const listGroups = () =>
  api.get('/api/groups').then(r => r.data)

// 🔹 Créer un groupe
export const createGroup = (payload: { name: string; description?: string }) =>
  api.post('/api/groups', payload).then(r => r.data)

// 🔹 Obtenir un groupe par ID
export const getGroup = (id: string) =>
  api.get(`/api/groups/${id}`).then(r => r.data)

// 🔹 Générer un lien d’invitation pour un groupe
export const createInviteLink = (id: string) =>
  api.post(`/api/invites/${id}/create`, {}).then(r => r.data)

// 🔹 Retirer un membre
export const removeMember = (groupId: string, userId: string) =>
  api.post(`/api/groups/${groupId}/remove`, { userId }).then(r => r.data)
