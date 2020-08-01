const express = require('express')
const router = express.Router()
const User = require('../models/user')

// All Users Route
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
    res.render('users/index', {users: users})
  } catch {
    res.redirect('/')
  }
})

// New User Route
router.get('/new', (req, res) => {
  res.render('users/new', { user : new User() })
})

// Create User Route
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password

  })
  try {
    const newUser = await user.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`users`)
  } catch {
    res.render('users/new', { user: user, errorMessage: 'Login error : please sign up' })
  }
})

// Attempt sign in Route
// router.post('/login', async (req, res) => {
//
//   res.redirect(`/users`)
//
// })
//
// const mongoose = require('mongoose')
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
// const db = mongoose.connection


//login page: storing and comparing email and password,and redirecting to home page after login



  router.post('/login', function (req, res) {
     User.findOne({ where: { email: req.body.email }
     }).then(function (err, user) {
         if (!user) {
            res.redirect('/customers');
         } else {
bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result == true) {
            res.redirect('/users');
        } else {
         res.send('Incorrect password');
         res.redirect('/');
        }
      });
     }
  });
});



module.exports = router
