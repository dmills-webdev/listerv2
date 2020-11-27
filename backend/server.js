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

app.use(session({secret: process.env.COOKIE_SECRET, resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.static('../client/build'))
app.use(upload.array())

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



// MIDDLEWARE

// Verify is user is logged in
function loggedIn(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

// Check username is not aleady in use
async function checkUsername(req, res, next) {
  const username = req.body.username
  console.log(username)
  const user = await User.findOne({username: username})
  if (user !== null) {
    console.log('Username in use')
    res.json(false)
  } else {
    console.log('Username NOT in use')
    next()
  }
}



app.get('/',
  function (req, res) {
    res.sendFile('../client/build/index.html')
  })

// Signup request
app.post(
  '/signup', checkUsername,
  async function(req, res) {
    // Generate passoword hash for database storage
    await bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        res.sendStatus(500)
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
        //res.redirect('/login')
        res.json(true)
      })
    })
  })

// Login request
app.post(
  '/login',
  passport.authenticate('local'),function(req, res) {
    res.json(req.user)
  })

// Logout request
app.get(
  '/logout',
  function(req, res) {
    req.session.destroy()
    res.redirect('/login')
  })

// API call to retrieve a user's todos
app.get(
  '/api/todos', loggedIn,
  function(req, res) {
    User.findOne({username: req.user.username})
    .then(user => {
      res.send(user.todos)
    })
    .catch(err => res.status(404).json({success: false}))
  })

// API call to update a user's todos
app.put(
  '/api/todos', loggedIn,
  async function(req, res) {
    const body = req.body.todos
    const username = req.user.username
    const doc = await User.findOne({username: username})
    doc.todos = body
    doc.save()
    res.json('All good')
  })

// API call to check if a username is already taken
app.post(
  '/api/signup/check-if-username-is-taken', checkUsername,
  function(req, res) {
    res.json(true)
  })



// Run server
const PORT = process.env.PORT || 3001;
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}, Woo!`)
})
