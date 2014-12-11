var db = require('../util/database');
var login = require('./login');
var addUser = require('./addUser');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    console.log('Serializing user: ' + user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    db.users.findOne({
      _id: id
    }, function(err, user) {
      console.log('Deserializing user: ' + user.username);
      done(err, user);
    });
  });
  login(passport);
  addUser(passport);

};