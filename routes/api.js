var express = require('express');
var router = express.Router();
var db = require('../util/YACHandler');
var path = require('path');
var config = require('../config');

/* GET api. */
router.get('/', function(req, res) {
    //res.render('404', {});
    res.send({
        error: 'invalid path'
    });
});


router.get('/comiclist', function(req, res) {
    var limit = req.query.limit;
    if (limit > 0) {
        var limitString = " LIMIT " + limit
    } else {
        var limitString = "";
    };
    db.getComicInfo("SELECT * FROM comic_info" + limitString, function(err, rows) {
        console.log(err);
        res.send(JSON.stringify(rows));
    });
});

//Searches comics for a specific id
router.get('/comic/:id', function(req, res) {
    console.log(req.params.id);

    db.getComicInfo("SELECT * FROM comic_info WHERE id=" + req.params.id, function(err, rows) {
        console.log(err);
        res.send(JSON.stringify(rows));
    });
});

//This should point to the file to the comic with the ID passed as a parameter
router.get('/comic/:id/file', function(req, res) {
    var comicID = req.query.id;
    //This should only ever return one document.
    if (comicID) {
        db.comics.findOne({
            _id: comicID
        }, function(err, doc) {
            if (doc) {
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

router.get('/comic/:id/thumbnail', function(req, res, next) {
    db.getComicInfo("SELECT * FROM comic_info WHERE id=" + req.params.id, function(err, rows) {
        console.log(err);
        if (rows[0]) {
            var thumbnailPath = config.path + '/.yacreaderlibrary/covers/' + rows[0].hash + '.jpg';
            console.log(thumbnailPath);
            res.sendFile(thumbnailPath.replace('/', '\\'), function(err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log('Sent: ' + thumbnailPath);
                }
            });
        } else {
          next();
        }
    });
});

//Returns a image of page in comic book
router.get('/comic/:id/page/:pagenum', function(req, res) {
    console.log("Comic ID: " + req.params.id + " Page Num: " + req.params.pagenum);
    //TODO: code here
});

//Searches the comics database for the passed series title and the chapter #
//Currently will return anyting that contains that number
router.get('/search/comics', function(req, res) {
    var searchQuery = {
        $and: [{
            series_title: /[a-zA-Z]/g
        }, {
            chapter: /[0-9]+$/
        }]
    };

    if (req.query.q)
        searchQuery.$and[0].series_title = new RegExp(req.query.q, 'gi');

    if (req.query.c) searchQuery.$and[1].chapter = /*new RegExp(*/ req.query.c; /*, 'g');*/

    db.comics.find(searchQuery, function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data));
    });

});

//Searches only series
router.get('/search/series', function(req, res) {
    var searchQuery = req.query.q;
    //TODO: Code for querying series
    db.series.find(searchQuery, function(err, data) {
        if (err) res.send(err);
        else res.send(JSON.stringify(data));
    });
});

router.get('/version', function(req, res) {
    res.send("MgaServer v0.1");
});

router.get('/dbinfo', function(req, res) {
    //TODO: return DB info. 
    res.send(JSON.stringify({
        Version: "test"
    }));
});

module.exports = router;