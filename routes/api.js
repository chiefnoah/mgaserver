var express = require('express');
var router = express.Router();
var db = require('../util/database');
var path = require('path');

/* GET api. */
router.get('/', function(req, res) {
  res.render('404', {});
});

//This should point to the file to the comic with the ID passed as a parameter
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
  } else {
    console.log('ERROR: no ID');
    res.send(JSON.stringify({
      error: 'No ID'
    }));
  }
});

//Searches both comics and series
router.get('/search', function(req, res) {
  var searchQuery = req.query.q;

});

//Searches only the comics
//If there is a q query variable set it searches that value in series_title
//If there is a c variable set it searches that value in chapters
router.get('/comic/search', function(req, res) {
  var searchQuery = {
    $and: [{
      series_title: /[a-zA-Z]/g
    }, {
      chapter: /[0-9]+$/
    }]
  };

  if (req.query.q)
    searchQuery.$and[0].series_title = new RegExp(req.query.q, 'gi');

  if (req.query.c) searchQuery.$and[1].chapter = new RegExp(req.query.c, 'g');

  db.comics_dbFind(searchQuery, function(err, data) {
    if (err) res.send(err);
    else res.send(JSON.stringify(data));
  });

});

//Searches only series
router.get('/series/search', function(req, res) {
  var searchQuery = req.query.q;
  //TODO: Code for querying series
});

module.exports = router;