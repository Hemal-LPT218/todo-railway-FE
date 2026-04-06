import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import { useTodos } from './hooks/useTodos'
import './App.css'

function TodoApp() {
  const { user, logout } = useAuth()
  const [inputValue, setInputValue] = useState('')
  const { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, clearError } = useTodos()

  const handleAddTodo = async () => {
    if (inputValue.trim()) {
      const success = await addTodo(inputValue.trim())
      if (success) {
        setInputValue('')
      }
    }
  }

  const handleToggleTodo = async (id: number) => {
    await toggleTodo(id)
  }

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  if (!user) {
    return <Login onLoginSuccess={() => { }} />
  }

  return (
    <div className="todo-app">
      <div className="app-header">
        <h1>Todo App</h1>
        <div className="user-info">
          <span>Welcome, {user.username}!</span>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="close-error">×</button>
        </div>
      )}

      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          disabled={isLoading}
        />
        <button onClick={handleAddTodo} disabled={isLoading || !inputValue.trim()}>
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                disabled={isLoading}
              />
              <span>{todo.text}</span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-button"
                disabled={isLoading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && todos.length === 0 && (
        <p className="empty-state">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <TodoApp />
    </AuthProvider>
  )
}

export default App
