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
  console.log("Opening database");
  var database = require('../util/database')(); //Just creating a database object automatically initializes it.
  res.status(200).send('Initializing db');
});
module.exports = router;