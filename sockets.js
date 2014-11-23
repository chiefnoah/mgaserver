module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log('client connected');
    //ALL SOCKET EVENTS GO IN HERE
    socket.emit('on connect', {message: 'Established socket connection'});
    io.on('disconnect', function() {
      console.log("client disconnected");
    });

  });
};
