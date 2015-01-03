var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./util/database');
var hbs = require('hbs');
var config = require('./config');
var dirMonitor = require('./util/dir_monitor')(config.path);
var passport = require('passport');
var user = require('./util/user');

//Routes
var routes = require('./routes/index');
var initialize = require('./routes/initialize');
//var series = require('./routes/series');
var api = require('./routes/api');

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(config.path)); //Serves the folder with the comic files

app.use(passport.initialize());
var initPassport = require('./passport/init');
initPassport(passport);

/*app.get('/', passport.authenticate('local', {
  session: false
}), function(req, res) {
  res.write(req.user.username);
});*/

app.use('/', routes);
app.use('/initialize', initialize);
var series = require('./routes/series')(passport);
app.use('/series', series);
app.use('/api', api);

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
