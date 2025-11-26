import { api } from './axios'


export const listTasks = () => api.get('/api/tasks').then(r => r.data)
export const createTask = (payload: any) => api.post('/api/tasks', payload).then(r => r.data)
export const updateTask = (id: string, payload: any) => api.put(`/api/tasks/${id}`, payload).then(r => r.data)
export const deleteTask = (id: string) => api.delete(`/api/tasks/${id}`).then(r => r.data)
export const listGroupTasks = (groupId: string) => api.get(`/api/tasks/group/${groupId}`).then(r => r.data)