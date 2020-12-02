import React from 'react'
import { useHistory } from 'react-router-dom'

import './scss/Login.scss'

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

  // Moves fake placeholder text on inputs move and stay at the new position as long as the input isn't empty
  function moveLabel(e) {
    const label = document.getElementById(e.target.name)
    if (e.target.value === '') {
      label.classList.toggle('focussedLabel')
    }
  }

  return(
    <div className='login-container'>

      <div className='welcome-banner'>
        <h1>
          Welcome back!
        </h1>
        <h2>
          Login and keep your lists synced across all your devices.
        </h2>
      </div>

      <div className='form-area'>
        <form onSubmit={handleSubmit} name='login' className='login-form'>

            <div className='input-container'>
              <label htmlFor='username' id='username'>
                Username
              </label>
              <input
                type='text'
                name='username'
                onFocus={moveLabel}
                onBlur={moveLabel}/>
            </div>

            <div className='input-container'>
              <label htmlFor='password' id='password'>
                Password
              </label>
              <input
                type='password'
                name='password'
                onFocus={moveLabel}
                onBlur={moveLabel}/>
            </div>

          <button name='submit-button' id='submit-button' hidden></button>
        </form>

        <label htmlFor='submit-button' className='submit-proxy-button'>
          Login
        </label>

      </div>
    </div>
  )
}

export default Signup
