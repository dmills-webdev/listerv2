import React from 'react'
import { useHistory } from "react-router-dom"

import './scss/Signup.scss'

function Signup() {
  const history = useHistory()

// Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    if (e.target.password.value === e.target.passwordConfirmation.value )  {
      const form = e.target
      const data = new FormData(form)
      await fetch('/signup', {
       method: 'POST',
       body: data,
      })
      history.push("/")
    }
    else {
      console.log('Error with inputs!')
    }
  }

  function moveLabel(e) {
    const label = document.getElementById(e.target.name)
    if (e.target.value === '') {
      label.classList.toggle('focussedLabel')
    }
  }

  return(
    <div className='signup-container'>

    <div className='welcome-banner'>
      <h1>
        Create account? Check.
      </h1>
      <h2>
        Signup to Lister for free and can keep your lists synced, on all your devices, all the time.
      </h2>
    </div>

    <div className='form-area'>
      <form onSubmit={handleSubmit} name='signup' className='signup-form'>

          <label htmlFor='username' id='username'>
            Username
          </label>
          <input
            type='text'
            name='username'
            onFocus={moveLabel}
            onBlur={moveLabel}/>

          <label htmlFor='password' id='password'>
            Password
          </label>
          <input
            type='password'
            name='password'
            onFocus={moveLabel}
            onBlur={moveLabel}/>

          <label htmlFor='passwordConfirmation' id='passwordConfirmation'>
            Confirm password
          </label>
          <input
            type='password'
            name='passwordConfirmation'
            onFocus={moveLabel}
            onBlur={moveLabel}/>

        <button name='submit-button' id='submit-button' hidden>Sign up</button>
      </form>

      <label htmlFor='submit-button' className='submit-proxy-button'>
        Signup
      </label>

    </div>
  </div>
  )
}

export default Signup
