import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { apiClient } from '../api'
import type { User } from '../api'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = apiClient.getToken()
    if (token) {
      // Token exists, but we need to validate it by fetching user data
      // For now, we'll assume the token is valid (in a real app, you'd validate it)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await apiClient.login({ username, password })
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await apiClient.register({ username, email, password })
      setUser(response.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    apiClient.clearToken()
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
