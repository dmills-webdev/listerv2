import React , { useState } from 'react'
import { useHistory } from 'react-router-dom'

import './scss/Login.scss'

function Signup({ setUser }) {
  const history = useHistory()

  const [ submitText, modifySubmitText ] = useState('Login')

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
    .then( user => {
      if (user === false ) {
        displayFormErrorMessage()
      }
      else {
        setUser(user)
        history.push('/')
      }
    })
  }

  // Form error visualisation
    // Modify login button to display that there is a problem with the login
    function displayFormErrorMessage() {
      modifySubmitText('Username or password incorrect, try again!')
      document.getElementById('submit-proxy').classList.add('error-styling')
    }
    // Revert login button back to normal
    function removeFormErrorMessage() {
      modifySubmitText('Login')
      document.getElementById('submit-proxy').classList.remove('error-styling')
    }
    // Clear error messages when any of the form input values change
    function clearErrorDisplay() {
      removeFormErrorMessage()
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
                onBlur={moveLabel}
                onChange={clearErrorDisplay}/>
            </div>

            <div className='input-container'>
              <label htmlFor='password' id='password'>
                Password
              </label>
              <input
                type='password'
                name='password'
                onFocus={moveLabel}
                onBlur={moveLabel}
                onChange={clearErrorDisplay}/>
            </div>

          <button name='submit-button' id='submit-button' hidden></button>
        </form>

        <label id='submit-proxy' htmlFor='submit-button' className='submit-proxy-button'>
          {submitText}
        </label>

      </div>
    </div>
  )
}

export default Signup
