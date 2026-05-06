import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, User } from 'lucide-react'
import { useAuth } from '../state/auth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = login(username.trim(), password)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="authShell">
      <div className="authModernCard">
        <div className="authHeader authHeaderModern">
          <div className="authTitle">Iniciar sesión</div>
          <div className="muted">Ingresa para administrar tu membresía y beneficios.</div>
        </div>

        <form className="authForm" onSubmit={onSubmit}>
          <label className="field">
            <div className="fieldLabel"><User size={16} /> Usuario</div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej: demo"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <div className="fieldLabel"><KeyRound size={16} /> Contraseña</div>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ej: demo"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="error">{error}</div> : null}

          <button className="btn btnPrimary btnLg authSubmit" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

