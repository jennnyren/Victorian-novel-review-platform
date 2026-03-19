const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// LocalStrategy — runs when user submits login form
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // Step 1 — find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    // Step 2 — compare submitted password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    // Step 3 — success, pass user to serializeUser
    return done(null, user);

  } catch (err) {
    return done(err);
  }
}));

// Serialize — save user ID into session after login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize — fetch full user from DB on every request using session ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//module.exports = passport;