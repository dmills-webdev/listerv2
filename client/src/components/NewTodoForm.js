import React, { useState } from "react"

const NewTodoForm = ({ submitNewTodo }) => {
  let [ task, updateTask ] = useState("")

  const handleInputChange = (e) => {
    updateTask(
      e.target.value
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()    // Prevent form submission
    submitNewTodo(task)   // Submit todo
    updateTask("")        // Clear textbox
  }

  return(
    <div className="new-todo-form">
      <form onSubmit={(e) => handleSubmit(e)} autoComplete="off">
        <label>
          <input
            name="task"
            value={task}
            placeholder="E.g. Water the plants"
            onChange={handleInputChange}
            type="text">
          </input>
        </label>

        <button
          type="submit">
            +
        </button>
      </form>
    </div>
  )
}

export default NewTodoForm
