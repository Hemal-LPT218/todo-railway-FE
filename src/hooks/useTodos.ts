import { useState, useEffect } from 'react'
import { apiClient } from '../api'
import type { Todo } from '../api'
import { useAuth } from '../contexts/AuthContext'

export const useTodos = () => {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchTodos()
    } else {
      setTodos([])
      setIsLoading(false)
    }
  }, [user])

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const todosData = await apiClient.getTodos()
      setTodos(todosData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos')
      console.error('Fetch todos error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addTodo = async (text: string): Promise<boolean> => {
    try {
      setError(null)
      const newTodo = await apiClient.createTodo(text)
      setTodos(prev => [...prev, newTodo])
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add todo'
      setError(errorMessage)
      console.error('Add todo error:', err)
      return false
    }
  }

  const toggleTodo = async (id: number): Promise<boolean> => {
    try {
      setError(null)
      const todo = todos.find(t => t.id === id)
      if (!todo) return false

      const updatedTodo = await apiClient.updateTodo(id, { completed: !todo.completed })
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo'
      setError(errorMessage)
      console.error('Toggle todo error:', err)
      return false
    }
  }

  const updateTodoText = async (id: number, text: string): Promise<boolean> => {
    try {
      setError(null)
      const updatedTodo = await apiClient.updateTodo(id, { text })
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo'
      setError(errorMessage)
      console.error('Update todo text error:', err)
      return false
    }
  }

  const deleteTodo = async (id: number): Promise<boolean> => {
    try {
      setError(null)
      await apiClient.deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo'
      setError(errorMessage)
      console.error('Delete todo error:', err)
      return false
    }
  }

  const clearError = () => setError(null)

  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    updateTodoText,
    deleteTodo,
    fetchTodos,
    clearError
  }
}
