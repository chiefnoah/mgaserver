//document.getElementById('socket_message').innerHTML = 'Not connected to server';

//Set loadDb to execute on click
//document.getElementById('load_database').onclick = loadDb();
function loadDb() {
  var socket_message = document.getElementById("socket_message");
  socket_message.innerHTML = "";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      socket_message.innerHTML = xmlhttp.responseText;
    }
  };
  xmlhttp.open("GET", "/initialize/load_database", true);
  xmlhttp.send();
}