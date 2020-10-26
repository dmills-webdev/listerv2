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

  return(
    <div className='signup-container'>
      <form onSubmit={handleSubmit} name='signup' className='signup-form'>

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

          <label htmlFor='passwordConfirmation'>
            Password
          </label>
          <input
            type='password'
            name='passwordConfirmation'/>

        <button id='submit-button'>Sign up</button>
      </form>
    </div>
  )
}

export default Signup
