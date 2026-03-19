module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();    // logged in → continue to route
  }
  res.redirect('/login');   // not logged in → back to login
};