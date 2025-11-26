import React, { useState, useContext } from 'react'
import { login as loginApi } from '../api/auth'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'


export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const { login } = useContext(AuthContext)
const navigate = useNavigate()


const handle = async (e: React.FormEvent) => {
e.preventDefault()
try {
const data = await loginApi({ email, password })
login(data.token, data.user)
navigate('/dashboard')
} catch (err: any) {
setError(err?.response?.data?.error || err.message || 'Login failed')
}
}


return (
<div className="max-w-md mx-auto p-6">
<h1 className="text-2xl mb-4">Connexion</h1>
<form onSubmit={handle} className="space-y-3">
<input className="w-full p-2 border" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
<input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
<div className="flex items-center justify-between">
<button className="px-4 py-2 bg-blue-600 text-white rounded">Se connecter</button>
<Link to="/register" className="text-sm text-blue-600">Créer un compte</Link>
</div>
{error && <div className="text-red-600">{error}</div>}
</form>
</div>
)
}