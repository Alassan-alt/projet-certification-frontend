import { api } from './axios'


export const createInvite = (groupId: string) => api.post(`/api/invites/${groupId}/create`, {}).then(r => r.data)
export const acceptInvite = (token: string) => api.post('/api/invites/accept', { token }).then(r => r.data)