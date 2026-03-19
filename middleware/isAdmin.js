module.exports = (req, res, next) => {
  if (req.isAuthenticated() && req.user.username === process.env.ADMIN_USERNAME) {
    return next();
  }
  res.redirect('/');    // non-admins get sent home
};