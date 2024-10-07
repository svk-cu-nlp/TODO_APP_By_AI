import React, { useState, useEffect } from 'react'
import { PlusCircle, Trash2, Calendar, Flag, Edit2, Check, X } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
  dueDate: string
  priority: 'low' | 'medium' | 'high'
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() !== '') {
      try {
        const response = await fetch('http://localhost:3001/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newTodo,
            dueDate: newDueDate,
            priority: newPriority,
          }),
        })
        const data = await response.json()
        setTodos([...todos, data])
        setNewTodo('')
        setNewDueDate('')
        setNewPriority('medium')
      } catch (error) {
        console.error('Error adding todo:', error)
      }
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id)
      if (todoToUpdate) {
        const response = await fetch(`http://localhost:3001/api/todos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...todoToUpdate,
            completed: !todoToUpdate.completed,
          }),
        })
        const updatedTodo = await response.json()
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/api/todos/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
    setEditDueDate(todo.dueDate)
    setEditPriority(todo.priority)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
    setEditDueDate('')
    setEditPriority('medium')
  }

  const saveEdit = async () => {
    if (editingId !== null) {
      try {
        const response = await fetch(`http://localhost:3001/api/todos/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: editText,
            dueDate: editDueDate,
            priority: editPriority,
          }),
        })
        const updatedTodo = await response.json()
        setTodos(todos.map(todo => todo.id === editingId ? updatedTodo : todo))
        cancelEditing()
      } catch (error) {
        console.error('Error updating todo:', error)
      }
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const priorityColors = {
    low: 'bg-green-200',
    medium: 'bg-yellow-200',
    high: 'bg-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Enhanced TODO App</h1>
        <form onSubmit={addTodo} className="mb-4 space-y-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <PlusCircle size={20} className="mr-2" /> Add Task
          </button>
        </form>
        <div className="mb-4 flex justify-center space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`flex items-center p-2 rounded-md ${priorityColors[todo.priority]}`}>
              {editingId === todo.id ? (
                <div className="flex-grow space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-1 border rounded-md"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="flex-grow p-1 border rounded-md"
                    />
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="p-1 border rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button onClick={saveEdit} className="text-green-500 hover:text-green-700">
                      <Check size={18} />
                    </button>
                    <button onClick={cancelEditing} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="mr-2"
                  />
                  <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                  <div className="flex items-center space-x-2">
                    {todo.dueDate && (
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar size={14} className="mr-1" /> {todo.dueDate}
                      </span>
                    )}
                    <Flag size={14} className={`text-${todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'yellow' : 'green'}-500`} />
                    <button
                      onClick={() => startEditing(todo)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App