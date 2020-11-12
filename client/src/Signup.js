import React from 'react'
import { useHistory } from "react-router-dom"

import './scss/Signup.scss'

function Signup() {
  const history = useHistory()

  async function validateForm(e) {
    const username = e.target.username.value
    const password = e.target.password.value
    const passwordConfirmation = e.target.passwordConfirmation.value
    let isUsernameFree
    await fetch('/api/signup/check-if-username-is-taken', {
     method: 'POST',
     body: JSON.stringify({ username }),
     headers: { 'Content-Type': 'application/json' }
    })
    .then( res => res.json() )
    .then( data => {isUsernameFree = data} )
    if (
      (isUsernameFree) &&
      (password === passwordConfirmation) &&
      (password.length > 8))
    {
      console.log('Form OK')
      return true
    }
    else {
      console.log('Form BAD')
      return false
    }
  }

// Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    e.persist()

    let isSubmissionValid
    await validateForm(e)
    .then(submissionValidity => {isSubmissionValid = submissionValidity})

    if ( isSubmissionValid )  {
      const form = e.target
      const data = new FormData(form)
      await fetch('/signup', {
       method: 'POST',
       body: data,
      })
      history.push("/login")
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
        New to Lister?
      </h1>
      <h2>
        Signup to Lister for free and keep your lists synced, on all your devices, all the time.
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
