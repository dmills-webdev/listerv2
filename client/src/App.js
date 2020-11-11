import React, { useState } from 'react'
import { BrowserRouter, NavLink, Route } from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Todos from './Todos'
import { NavbarLoggedIn, NavbarLoggedOut } from './components/Navbar'

import "./scss/App.scss"
import hamburger from './assets/hamburger.svg'

function App() {
  // App's local record if a user appears logged in or not, passed to Navbar
  const [ user, setUser ] = useState(null)

  // Toggles dropdown menu visibility change on mobile site
  function toggleMenu(e) {
    const menu = document.getElementById('main-nav')
    menu.classList.toggle('nav-popout')
  }

  // Gets the username of the user to display in the header bar
  function getUsername() {
    if (user !== null) {
      return user.username
    }
  }

  return(
    <BrowserRouter>
        <header className='main-header'>

          <div className='mobile-username'>
            {getUsername()}
          </div>

          <NavLink
            to='/' exact
            activeClassName='activeLink'
            className='logo'>
              Lister
          </NavLink>

          <div
            className='hamburger-icon'
            onClick={toggleMenu}>
            <img src={hamburger} alt='Hamburger menu icon for navigation menu'/>
          </div>

          {/*Change navbar options depending on if the user is logged in or not*/}
          { user ?
            <NavbarLoggedIn user={user} setUser={setUser}/>
            :
            <NavbarLoggedOut/>
          }
        </header>

        <main>
          <Route
            exact path='/signup'
            component={Signup} />

          <Route
            exact path='/login'
            render={(props) => (
              <Login {...props} isAuthed={true}
                setUser={setUser}/>
            )} />

          <Route
            exact path='/'
            render={(props) => (
              <Todos {...props} isAuthed={true}
                user={user}/>
            )} />
        </main>
    </BrowserRouter>
  )
}

export default App
