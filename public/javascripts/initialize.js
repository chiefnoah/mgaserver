document.getElementById('socket_message').innerHTML = 'No message received';
var socket = io();

socket.on('on connect', function(data) {  document.getElementById('socket_message').innerHTML = data.message;
});

function loadDb() {
  io.emit('load db');
}
