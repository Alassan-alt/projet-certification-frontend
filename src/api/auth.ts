import { api } from './axios'
import type { AxiosResponse } from 'axios'


export const register = (payload: { name: string; email: string; password: string }) =>
api.post('/api/auth/register', payload).then((res: AxiosResponse) => res.data)


export const login = (payload: { email: string; password: string }) =>
api.post('/api/auth/login', payload).then((res: AxiosResponse) => res.data)