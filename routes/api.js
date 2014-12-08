var express = require('express');
var router = express.Router();
var db = require('../util/database');
var path = require('path');

/* GET api. */
router.get('/', function(req, res) {
  res.render('404', {});
});

//This should point to the file to the comic with the ID
router.get('/comics', function(req, res) {
  var comicID = req.query.id;
  //This should only ever return one document.
  if (comicID) {
    db.comics_dbFindOne({
      _id: comicID
    }, function(err, doc) {
      if (doc) {
        //console.log(doc);
        //TODO: send file
        //res.set('Content-Type', 'text/html');
        //res.send(doc[0].relative_path);
        console.log(doc.relative_path);
        //Set the mime type to a default value
        var mimeType = 'application/octet-stream';
        if (path.extname(doc.relative_path) === '.cbz') {
          mimeType = 'application/x-cbz';
        } else if (path.extname(doc.relative_path) === '.cbr') {
          mimeType = 'application/x-cdisplay';
        }

        var options = {
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'Content-Type': mimeType,
            'Content-Disposition': 'filename=' + path.basename(doc.relative_path)
          }
        };
        res.sendFile(doc.relative_path, options, function(err) {
          if (err) {
            console.log(err);
            res.status(err.status).end();
          } else {
            console.log('Sent:', doc.relative_path);
          }
        });
      }
    });
  }
});

//Searches both comics and series
router.get('/search', function(req, res) {
  var searchQuery = req.query.q;

});

//Searches only the comics
router.get('/comics/search', function(req, res) {
  var searchQuery = req.query.q;
});

//Searches only series
router.get('/series/search', function(req, res) {
  var searchQuery = req.query.q;

});

module.exports = router;