document.getElementById('socket_message').innerHTML = 'Not connected to server';
var socket = io();

socket.on('on connect', function(data) {  document.getElementById('socket_message').innerHTML = data.message;
});


//Set loadDb to execute on click
//document.getElementById('load_database').onclick = loadDb();
function loadDb() {
  socket.emit('load db', {});
}
