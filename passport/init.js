var db = require('../util/database').users;
var DigestStrategy = require('passport-http').DigestStrategy;

module.exports = function(passport) {


  function findByUsername(username, fn) {
    console.log('Searching for username: ' + username);
    db.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        console.log(err);
        return fn(err, null);
      }
      if (user) {
        console.log('User: ' + user.username + '\nPass: ' + user.password);
        return fn(null, user);
      }
      console.log(user);
      return fn(null, null);
    });
  }


  passport.use(new DigestStrategy({
    qop: 'auth'
  }, function(username, done) {
    findByUsername(username, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      return done(null, user, user.password);
    });
  }));






};