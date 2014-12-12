var db = require('database');

//Database model
var model = {
  username: '',
  password: '',

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