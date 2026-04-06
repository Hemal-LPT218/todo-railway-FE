import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  userId: string
}

function TodoApp() {
  const { user, logout } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem(`todos_${user?.id}`)
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [user?.id])

  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos)
    if (user) {
      localStorage.setItem(`todos_${user.id}`, JSON.stringify(newTodos))
    }
  }

  const addTodo = () => {
    if (inputValue.trim() && user) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        userId: user.id
      }
      saveTodos([...todos, newTodo])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    saveTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    saveTodos(todos.filter(todo => todo.id !== id))
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
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="empty-state">No todos yet. Add one above!</p>}
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
