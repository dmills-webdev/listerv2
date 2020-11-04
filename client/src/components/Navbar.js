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
      <div className={`logged-in-message nav-item`}>
        Logged in as: {user.username}
      </div>
      <div onClick={logout} className='nav-item'>
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
        className='nav-item'>
          Signup
      </NavLink>

      <NavLink
        to='/login' exact
        activeClassName='activeLink'
        className='nav-item'>
          Login
      </NavLink>

      <NavLink
        to='/' exact
        activeClassName='activeLink'
        className='nav-item'>
          Todos
      </NavLink>
    </nav>
  )
}

export { NavbarLoggedIn, NavbarLoggedOut }
