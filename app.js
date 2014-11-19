//Dependencies
var express = require('express');
var connect = require('connect');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());
app.use(connect.json());
app.use(connect.urlencoded());
//Routes
require('./routes/routes.js');
app.listen(port);
console.log('Server is running on port: ' + port);
