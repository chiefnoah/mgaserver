var express = require('express');
var router = express.Router();
var config = require('../config.js');

// Handle basic reqest at this path
router.get('/', function(req, res) {
  res.render('initialize', {db_path: config.path});
});


module.exports = router;
