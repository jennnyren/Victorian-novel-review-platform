const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

// GET /register — show registration form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// POST /register — handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/register');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already taken');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Victorian Novels!');
      res.redirect('/novels');
    });

  } catch (err) {
    console.log(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/register');
  }
});

// GET /login — show login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST /login — handle login with passport
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true //← passport sends its own error message automatically
}));

// GET /logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;
