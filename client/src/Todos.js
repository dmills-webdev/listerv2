import React, { useState, useEffect } from 'react'

import TodoList from './components/TodoList'
import NewTodoForm from './components/NewTodoForm'

import './scss/Todos.scss'

function Todos({ user }) {

// TODO: fix new user default todo problem

// Default single todo to display to unregsitered or brand new users
  const defaultTodos = [{
    id: 0,
    task: 'Write first todo (or list item!)',
    completed: false
  }]
  const [ todos, modifyTodos ] = useState(defaultTodos)

// Load user's todos
  useEffect(() => {
    // If locally the user seems to be logged in then fetch their todos
    if (user !== null) {
      fetch('/api/user-todos')
        .then(res => res.json())
        .then(todos => {
          if ( Array.isArray(todos) && todos[0] && todos[0].id !== 0 )  { // Use database todos unless problem with array
            modifyTodos(todos)
          }
        })
    }
    // If user does not seem to be logged in locally then default back to the defaultTodos
    else {
      modifyTodos(defaultTodos)
    }
  }, [user])



// Update users todo storage when modified
  useEffect(() => {
    if (user !== null) { // Check if user appears logged in, if so then PUT the updated todos to the database
      fetch('api/user-todos', {
        method: 'PUT',
        body: JSON.stringify({todos}),
        headers: { 'Content-Type': 'application/json' }
      })
      .then( res => res.json() )
      .then( data => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    }
  }, [todos])


// Add new todo to list
  const submitNewTodo = (newTask) => {
    let d = new Date()
    let timeBasedID = d.getTime() // Generates a unique-to-user ID based on the time the todo is submitted
    let newTodo = {
      id: timeBasedID,
      task: newTask,
      completed: false
    }
    modifyTodos(oldTodos => [...oldTodos, newTodo]) // Add todo onto end of existing todo array
  }

// Delete todo
  const removeTodo = (id) => {
    modifyTodos(
      todos.filter(todo => todo.id !== id) // FIlter out the id in question and make that the new existing todo array
    )
  }

// Toggle a todo's completion status
  const toggleCompleted = (id) => {
    let updatedTodos = todos.map(todo => { // Linear search for the right todo item in existing todo array
      if (todo.id === id) {
        todo.completed = !todo.completed // Boolean flip of todo property on todo that matches the todo id that was clicked
      }
      return todo
    })
    modifyTodos(
      updatedTodos
    )
  }

///////////////////////////////////////////////////////////////// Presentational
  return(
    <div>
      <TodoList
        todos={todos}
        toggleCompleted={toggleCompleted}
        removeTodo={removeTodo}/>
      <NewTodoForm
        submitNewTodo={submitNewTodo}/>
    </div>
  )
}

export default Todos
