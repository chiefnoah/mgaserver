var db = require('database');
var config = require('../config');

//Loops through the users in the config and inserts them into the database if they don't already exists
for (var i = 0; i < config.users.length; i++) {
  var u = new model();
  u.username = config.users[i].username;
  u.password = config.users[i].password;
  u.admin = config.users[i].admin;
  u.sync = config.users[i].admin;
  db.users.update({
    username: u.username
  }, u, {
    upsert: true
  });
}



//Database model
var model = {
  username: '',
  password: '',
  admin: true,
  sync: true,

  favorites: [],
  completed: [{
    comic: {
      _id: '',
      completed: false,
      last_read: 0
    }
  }]
};





module.exports = {
  model: model
};