var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var YACHandler = require('./util/YDBHandler');
var db = require('./util/database');

var hbs = require('hbs');
var config = require('./util/settings_handler').getConfig();

//TODO: Check if using YACReader or ComicRack backend or if we should initialize the dirmonitor
//var dirMonitor = require('./util/dir_monitor')(config.path);

//Routes
var routes = require('./routes/index');
//var initialize = require('./routes/initialize');
//var series = require('./routes/series');
var api = require('./routes/api');
var authentication = require('./routes/authentication');

var app = express();
app.set('env', 'dev'); //Sets the environment to developer mode
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(config.path)); //Serves the folder with the comic files


//Authentication router
app.use(authentication);


app.use('/', api);
//app.use('/api', api); //old api path
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('404', {});
});


module.exports = app;
