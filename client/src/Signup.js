import React, { useState } from 'react'
import { useHistory } from "react-router-dom"

import './scss/Signup.scss'

function Signup() {
  const history = useHistory()

// String content of the submit button which varies if there are errors in the inputs that need to be fixed before the form can be submitted
  const [ submitText, modifySubmitText ] = useState('Submit')

// Locally validate signup details
  function validateForm(e) {
    const password = e.target.password.value
    const passwordConfirmation = e.target.passwordConfirmation.value
    if ((password === passwordConfirmation) && // Passwords match
        (password.length >= 8)) // Password minimum length is 8 characters
    {
      return true // Form is valid
    }
    else {
      // Push all relevant validation errors into an array and return it
      var errorBoxMessage =[]
      if (password !== passwordConfirmation) {
        errorBoxMessage.push(`Passwords don't match!`)
      }
      if (password.length <= 8) {
        errorBoxMessage.push(`Minimum password length 8 characters!`)
      }
      return errorBoxMessage
    }
  }

// Handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    e.persist() // Persist form event for clientside validation and then to be sent to server

    const isSubmissionValid = validateForm(e)

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
          displayFormErrorMessage()
          displayErrorBox(['Username already in use, try something else!'])
        }
      })
    }
    else {
      // Form rejected clientside for password validtion issues, display error
      displayFormErrorMessage()
      removeErrorBox()
      displayErrorBox(isSubmissionValid)
    }
  }


// Form error visualisation
  // Modify submit button to display that there is an error in the form
  function displayFormErrorMessage() {
    modifySubmitText('Error in form!')
    document.getElementById('submit-proxy').classList.add('error-styling')
  }
  // Revert submit button back to normal
  function removeFormErrorMessage() {
    modifySubmitText('Submit')
    document.getElementById('submit-proxy').classList.remove('error-styling')
  }
  // Display error box in form
  function displayErrorBox( validationErrors ) {
    document.getElementById('form-container').classList.add('shrink-width')

    const errorBox = document.getElementById('error-box')
    validationErrors.map(item => {
      let errorItem = document.createElement('div')
      errorItem.textContent = item
      errorBox.appendChild(errorItem)
    })
    errorBox.classList.add('visible')
  }
  // Remove error box in form
  function removeErrorBox() {
    document.getElementById('form-container').classList.remove('shrink-width')

    const errorBox = document.getElementById('error-box')
    errorBox.classList.remove('visible')
    errorBox.textContent = ''
  }
  // Clear error messages when any of the form input values change
  function clearErrorDisplay() {
    removeErrorBox()
    removeFormErrorMessage()
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
      <form onSubmit={handleSubmit} name='signup' className='signup-form' autoComplete='off'>
        <div id='form-container'>
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

          <div className='input-container'>
            <label htmlFor='passwordConfirmation' id='passwordConfirmation'>
              Confirm password
            </label>
            <input
              type='password'
              name='passwordConfirmation'
              onFocus={moveLabel}
              onBlur={moveLabel}
              onChange={clearErrorDisplay}/>
          </div>
          <div id='error-box'>Error</div>

          <button name='submit-button' id='submit-button' hidden></button>
        </div>
      </form>

      <label id='submit-proxy' htmlFor='submit-button' className='submit-proxy-button'>
        {submitText}
      </label>
    </div>
  </div>
  )
}

export default Signup
