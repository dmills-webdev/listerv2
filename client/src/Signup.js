import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

import './scss/Signup.scss'

function Signup() {
  const history = useHistory()

// String content of the submit button which varies if there are errors in the inputs that need to be fixed before the form can be submitted
  const [ submitText, modifySubmitText ] = useState('Submit')

// Validate signup details
  function validateForm(e) {
    const password = e.target.password.value
    const passwordConfirmation = e.target.passwordConfirmation.value
    if ((password === passwordConfirmation) && // Passwords match
        (password.length >= 8)) // Password minimum length is 8 characters
    {
      return true // Form is valid
    }
    else if (password !== passwordConfirmation) {
      return `Passwords don't match, try retyping them!`
    }
    else if (password.length <= 8) {
      return `Password too short, make sure it's at least 8 characters long!`
    }
  }

// Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    e.persist() // Persist form event for clientside validation and then to be sent to server

    // Call function to check form value validity
    let isSubmissionValid
    await validateForm(e)
    .then(submissionValidity => {isSubmissionValid = submissionValidity})

    if ( isSubmissionValid === true )  {
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
          // Form rejected serverside for username already being in use, display error
          displayFormErrorMessage('Username already in use, try something else!')
        }
      })
    }
    else {
      displayFormErrorMessage(isSubmissionValid)
    }
  }


// Display form errors
  // Submit button error
  function displayFormErrorMessage( message ) {
    modifySubmitText(message)
    document.getElementById('submit-proxy').classList.add('error-styling')
  }
  function removeFormErrorMessage() {
    modifySubmitText('Submit')
    document.getElementById('submit-proxy').classList.remove('error-styling')
  }

// Moves and shrinks form input label when the input gains focus
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
      <form onSubmit={handleSubmit} name='signup' className='signup-form' autocomplete='off'>

          <div className='input-container'>
            <label htmlFor='username' id='username'>
              Username
            </label>
            <input
              type='text'
              name='username'
              onFocus={moveLabel}
              onBlur={moveLabel}
              onChange={removeFormErrorMessage}/>
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
              onChange={removeFormErrorMessage}/>
          </div>

          <div className='input-container'>
            <label htmlFor='passwordConfirmation' id='passwordConfirmation'>
              Confirm password
            </label>
            <input
              type='password'
              name='passwordConfirmation'
              onFocus={moveLabel}
              onBlur={moveLabel}
              onChange={removeFormErrorMessage}/>
          </div>

        <button name='submit-button' id='submit-button' hidden></button>
      </form>

      <label id='submit-proxy' htmlFor='submit-button' className='submit-proxy-button'>
        {submitText}
      </label>

    </div>

    <div id='error-box' hidden>Error</div>


  </div>
  )
}

export default Signup
