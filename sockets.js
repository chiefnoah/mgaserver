module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('client connected');
    //ALL SOCKET EVENTS GO IN HERE
    socket.emit('on connect', {message: 'Established socket connection'});
    io.on('disconnect', function() {
      console.log("client disconnected");
    });

    io.on('load db', function() {
      //TODO: Code for generating the SQLite3 database from the provided path
    });


  });
};
