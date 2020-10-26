import React, { useState, useEffect } from "react"

import TodoList from "./components/TodoList"
import NewTodoForm from "./components/NewTodoForm"

import "./scss/Todos.scss"

const App = () => {
  const [ todos, modifyTodos ] = useState([])
  const defaultTodos = [{
    id: 1,
    task: "Write first todo",
    completed: false
  }]

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json() )
      .then(data => {
        if (data.todos) {
          modifyTodos(data.todos)
        }
        else {
          modifyTodos(defaultTodos)
        }
      })
  }, [defaultTodos])


  // Add new todo to list
  const submitNewTodo = (newTask) => {
    let d = new Date()
    let timeBasedID = d.getTime() // Generates a unique ID based on the time the todo is submitted
    let newTodo = {
      id: timeBasedID,
      task: newTask,
      completed: false
    }
    modifyTodos(oldTodos => [...oldTodos, newTodo])
  }

  // Delete todo
  const removeTodo = (id) => {
    modifyTodos(
      todos.filter(todo => todo.id !== id)
    )
  }

  // Toggle a todo's completion status
  const toggleCompleted = (id) => {
    let updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
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

export default App
