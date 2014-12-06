var express = require('express');
var router = express.Router();
var config = require('../config.js');

// Handle basic reqest at this path
router.get('/', function(req, res) {
  res.render('initialize', {
    db_path: config.path
  });
});

router.get('/load_database', function(req, res) {
  var scanner = require('../util/scanner')(); //Calls the scanner function
  res.status(200).send('Initializing db');
});

module.exports = router;
