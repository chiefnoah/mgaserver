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
  var scanner = require('../util/scanner')(function(data) {
    var output = '<table width="100%"border="1"><tr><th>Series</th><th>Chapter</th><th>Path</th></tr>';
    if (data) {
      for (var i = 0; i < data.length; i++) {
        output += '<tr><td>' + data[i].series_title + '</td><td>' + data[i].chapter + '</td><td>' + data[i].relative_path + '</td>';
      }
    } else {
      output = '<p><i>No new files added</i></p>';
    }
    res.status(200).send(output);
  }); //Calls the scanner function. Returns the scanned comic metadata

});


module.exports = router;