const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config() // Used to hide mongo information
const multer = require('multer') // Handles multipart form data
const session = require('express-session') // Used for login cookie
const passport = require('passport') // Used for user validation
const bcrypt = require('bcryptjs') // Used for password hashing before storage in database

const LocalStrategy = require('passport-local').Strategy

// Database setup
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const mongoDb = process.env.MONGODB
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongo connection error!'))

const User = mongoose.model(
  'User',
  new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    todos: {type: Array, required: false}
  })
)

// Init app
const app = express()
const upload = multer()

// For parsing multipart/form-data
app.use(upload.array())
app.use(express.static('public'))

// Verify is user is logged in
function loggedIn(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Verify login details against database of users
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err)
      };
      if (!user) {
        return done(null, false, { msg: 'Incorrect username' })
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          console.log('User:' + user.username + ' logged in succesfully')
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false, {msg: "Incorrect password"})
        }
      })
    })
  })
)
passport.serializeUser(function(user, done) {
  done(null, user.id)
})
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

// App middleware
app.use('/', express.static(path.join(__dirname, './client/build')))
app.use(session({secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())


// Signup request
app.post(
  '/signup',
  async function(req, res, next) {
    // Confirm serverside again that the username requested definitely isn't alredy registered
    let usernameCheck
    await User.findOne({username: req.body.username})
    .then( user => {usernameCheck = user})
    .catch( err => console.log(err) )
    if (usernameCheck !== null) { // Should fail, meaning to user with that username exists
      return next()
    }

    // Generate passoword hash for database storage
    await bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err)
      }
      // Create and save user to database
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        todoList: []
      })
      .save(err => {
        if (err) {
          console.log(err)
        }
        res.redirect('/login')
      })
    })
  }
)

// Login request
app.post(
  '/login',
  passport.authenticate('local'),function(req, res, next) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.json(req.user)
  }
)

// Logout request
app.get('/logout',
  function(req, res, next) {
    req.session.destroy()
    res.redirect('/login')
  }
)


// API call to retrieve a user's todos
app.get(
  '/api/user-todos', loggedIn,
  function(req, res, next) {
    User.findOne({username: req.user.username})
    .then(user => {
      res.send(user.todos)
    })
    .catch(err => res.status(404).json({success: false}))
  }
)

// API call to update a user's todos
app.put(
  '/api/user-todos', loggedIn,
  async function(req, res, next) {
    const body = req.body.todos
    const username = req.user.username
    const doc = await User.findOne({username: username})
    doc.todos = body
    doc.save()
    res.json('All good')
  }
)

// API call to check if a username is already taken
app.post(
  '/api/signup/check-if-username-is-taken',
  async function(req, res, next) {
    const username = req.body.username
    console.log(username)
    const doc = await User.findOne({username: username})
    if (doc !== null) {
      console.log('Username in use')
      res.json(false)
    } else {
      console.log('Username NOT in use')
      res.json(true)
    }
  }
)



// Run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}, Woo!`)
})
