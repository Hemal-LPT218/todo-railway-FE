import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface LoginProps {
  onLoginSuccess: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const { login, register, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      let success = false
      if (isRegistering) {
        success = await register(username, email, password)
        if (!success) {
          setError('Registration failed. Username or email might already exist.')
        }
      } else {
        success = await login(username, password)
        if (!success) {
          setError('Invalid credentials. Please check your username and password.')
        }
      }

      if (success) {
        onLoginSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isRegistering ? 'Register' : 'Login'} to Todo App</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={4}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>
        <div className="toggle-mode">
          <p>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={toggleMode} className="toggle-button">
              {isRegistering ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
