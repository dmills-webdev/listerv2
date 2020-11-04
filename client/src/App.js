import React, { useState } from 'react'
import { BrowserRouter, NavLink, Route } from 'react-router-dom'

import Signup from './Signup'
import Login from './Login'
import Todos from './Todos'

import { NavbarLoggedIn, NavbarLoggedOut } from './components/Navbar'

import "./scss/App.scss"

function App() {

  const [ user, setUser ] = useState(null)

  if (user !== null) {

  }


  return(
    <BrowserRouter>
      <div>

        <header>

          <div className='logo'>
            Lister
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

      </div>
    </BrowserRouter>
  )
}

export default App
