var express = require('express');
var router = express.Router();

// Handle basic reqest at this path
router.get('/', function(req, res) {
  res.render('initialize', {db_path: '<i>none</i>'});
});


module.exports = router;
