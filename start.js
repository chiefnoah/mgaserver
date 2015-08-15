var forever = require('forever-monitor');

var child = new (forever.Monitor)('www', {});

child.on('exit', function() {
	console.log("Process quitting after 10 attempts");
});

child.on('restart', function() {
	console.log('Restarting server');
})

child.on('watch:restart', function() {
	console.log('manually restarting server');
})
child.start();