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
  var scanner = require('../util/scanner')(); //Calls the scanner function. Returns the scanned comic metadata
  console.log(scanner);
  var output = '<table><tr><th>Series</th><th>Chapter</th><th>Path</th></tr>';
  /*for(var i = 0; i < scanner.length; i++) {
      output+= '<tr><td>' + scanner[i].series_title + '</td><td>' + scanner[i].chapter + '</td><td>' + scanner[i].relative_path + '</td>';
  } */
  //console.log(output);
  res.status(200).send(output);
});

module.exports = router;