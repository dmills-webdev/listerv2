import React from "react"
import classNames from "classnames"

const classes = classNames({ // Apply multiple classes to the element
      "remove-todo": true,
      "float-right": true
    })

const TodoItem = ({ id, task, completed, toggleCompleted, removeTodo }) => (
  <div className="todo-item">
    <input
      type="checkbox"
      value={completed}
      checked={completed}
      onChange={() => toggleCompleted(id)}/>

    <span className={completed ? "completed-todo" : null}> {/*Toggle styling if todo is completed*/}
      {task}
    </span>

    <button
      type="button"
      className={classes}
      onClick={() => removeTodo(id)}>
      Remove
    </button>

  </div>
)

export default TodoItem
