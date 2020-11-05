import React from 'react'
import { NavLink } from 'react-router-dom'


function NavbarLoggedIn({ user, setUser }) {
  // Log current user out
  function logout() {
    fetch('/logout')
    .then( setUser(null) )
  }
  return (
    <nav>
      <div className='nav-user'>
        {user.username}
      </div>
      <div className='nav-button' onClick={logout}>
        Logout
      </div>
    </nav>
  )
}

function NavbarLoggedOut() {
  return (
    <nav>
      <NavLink
        to='/signup' exact
        activeClassName='activeLink'
        className='nav-button'>
          Signup
      </NavLink>

      <NavLink
        to='/login' exact
        activeClassName='activeLink'
        className='nav-button'>
          Login
      </NavLink>

      <NavLink
        to='/' exact
        activeClassName='activeLink'
        className='nav-button'>
          Todos
      </NavLink>
    </nav>
  )
}

export { NavbarLoggedIn, NavbarLoggedOut }
