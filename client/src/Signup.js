import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

import './scss/Signup.scss'

function Signup() {
  const history = useHistory()

  const [ submitText, modifySubmitText ] = useState('Submit')

// Validate signup details
  async function validateForm(e) {
    const password = e.target.password.value
    const passwordConfirmation = e.target.passwordConfirmation.value
    if (
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

// Display form errors
  function displayFormErrorMessage( message ) {
    modifySubmitText(message)
    document.getElementById('submit-proxy').classList.toggle('error-styling')
  }

  function removeFormErrorMessage() {
    modifySubmitText('Submit')
    document.getElementById('submit-proxy').classList.remove('error-styling')
  }

// Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    e.persist() // Persist form event for clientside validation and then to be sent to server

    // Call function to check form value validity
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
      .then( res => res.json() )
      .then( submitAccepted => {
        if (submitAccepted) {
          // Username was accepted and account was created
          history.push('/login')
        } else {
          displayFormErrorMessage('Username already in use, try something else!')
        }
      })
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
            onBlur={moveLabel}
            onChange={removeFormErrorMessage}/>

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

      <label id='submit-proxy' htmlFor='submit-button' className='submit-proxy-button'>
        {submitText}
      </label>

    </div>
  </div>
  )
}

export default Signup
