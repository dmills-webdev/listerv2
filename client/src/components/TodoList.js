import React from "react"
import TodoItem from "./TodoItem"

const TodoList = ({ todos, toggleCompleted, removeTodo }) => {
  return(
    <div className="todo-container">
      {
        todos.map(todo => {
          return(
            <TodoItem
              key={todo.id}
              toggleCompleted={toggleCompleted}
              removeTodo={removeTodo}
              id={todo.id}
              task={todo.task}
              completed={todo.completed}/>
          )
        })
      }
    </div>
  )
}

export default TodoList
