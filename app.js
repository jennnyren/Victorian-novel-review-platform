require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//const passport = require('./middleware/passport');
const passport = require('passport');
require('./middleware/passport');
const authRoutes = require('./routes/auth');
const novelRoutes = require('./routes/novels');
const methodOverride = require('method-override'); 
const reviewRoutes = require('./routes/reviews');
const path = require('path');
const flash = require('connect-flash');


const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.log('Connection failed: ', err));

// Middleware
app.use(express.urlencoded({ extended: true })); // parses form data
app.use(express.json());                          // parses JSON data

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// make flash messages available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // tell express where views live

// make currentUser available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Static files — add before routes
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(authRoutes);
app.use(novelRoutes);
app.use(reviewRoutes); 

app.get('/', (req, res) => {
  res.render('home');    // renders views/home.ejs
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});