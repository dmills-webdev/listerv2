import React from 'react'
import { useHistory } from 'react-router-dom'

function Signup({ setUser }) {
  const history = useHistory()

// Handle form submission
  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    fetch('/login', {
     method: 'POST',
     body: data,
    })
    .then( res => res.json() )
    .then( user => setUser(user) )

    history.push('/')
  }

  return(
    <div className='login-container'>

      <h1>Login</h1>

      <form onSubmit={handleSubmit} name='login' className='login-form'>

          <label htmlFor='username'>
            Username
          </label>
          <input
            type='text'
            name='username'/>

          <label htmlFor='password'>
            Password
          </label>
          <input
            type='password'
            name='password'/>

        <button id='submit-button'>Login</button>

      </form>

    </div>
  )
}

export default Signup
