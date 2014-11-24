module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('client connected');
    //ALL SOCKET EVENTS GO IN HERE
    socket.emit('on connect', {message: 'Established socket connection'});

    socket.on('load db', function() {
      //TODO: Code for generating the database from the provided path
      console.log("Opening database");
      var database = require('./util/database')(); //Just creating a database object automatically initializes it.
    });




    io.on('disconnect', function() {
      console.log("client disconnected");
    });
  });
};
