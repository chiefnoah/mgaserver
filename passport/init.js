var db = require('../util/database').users;
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {


  function findUser(username, fn) {
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


  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done) {
    db.findOne({
      username: username
    }, function(err, uesr) {
      if (err) return done(err);

      if (!user) {
        console.log('User ' + username + ' not found');
        return done(null, false, req.write('User not found'));
      }
      if (user.password === password) {
        console.log("Invalid password");
        return done(null, false, req.write('Invalid password'));
      }
      return done(null, user);
    });
  }));


};