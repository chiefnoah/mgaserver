var express = require('express');
var router = express.Router();
var db = require('../util/YDBHandler');
var config = require('../util/settings_handler').getConfig();

router.get("/", function(req, res, next) {
    if (req.query.cmd) {
        var cmd = req.query.cmd;
        switch (cmd) {
            case 'restart':
                console.log('restarting server...');
                //TODO: restart server
                break;
            case 'reset':
                console.log('resetting server');
                //TODO: reset server
                break;
            case 'stop':
                console.log('stopping server');
                //TODO: stop server
                break;
            default:
                next();
        }
    } else {
      next();
    }
});

//TODO: restructure to accept query arguments
router.get('/comiclist', function(req, res) {
    db.getComicInfo([], function(err, rows) {
        if (err) console.log(err);
        res.send(JSON.stringify({
            total_count: rows.length,
            page_count: rows.length,
            comics: rows
        }));
    });
});

//Searches comics for a specific id
router.get('/comic/:id', function(req, res) {
    //console.log(req.params.id);

    db.getComicInfo(["I.id = " + req.params.id], function(err, rows) {
        if (err) {
          console.log(err); 
          res.status(404).end();
          return;
        }
        res.send(JSON.stringify({
            total_count: rows.length,
            page_count: rows.length,
            comics: rows
        }));
    });
});

//TODO: convert this to comicstreamer compatible
//This should point to the file to the comic with the ID passed as a parameter
router.get('/comic/:id/file', function(req, res) {
    var comicID = req.query.id;
    //This should only ever return one document.
    //if (comicID) {
    if (false) {
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
    //TODO: extract comic file and serve up the page
});

router.get('/folders/0/:path', function(req, res) {
  var path = "/" + req.params.path;
  console.log("Path: " + path);
  db.getFolders(path, function(result) {
    res.send(JSON.stringify(result));
  });
});

router.get('/folders/0/', function(req, res) {
  var path = '/';
  console.log("Path: " + path);
  db.getFolders(path, function(result) {
    res.send(JSON.stringify(result));
  });
});

router.get('/folders', function(req, res) {
  var path = '/';
  console.log("Path: " + path);
  db.getFolders(path, function(result) {
    res.send(JSON.stringify(result));
  });
});

router.get('/version', function(req, res) {
    res.send(JSON.stringify({
        server: "MgaServer v0.1",
        version: "0.0.7"
    }));
});

router.get('/dbinfo', function(req, res) {
    //TODO: return DB info. 
    res.send(JSON.stringify({
        Version: "test"
    }));
});

module.exports = router;


//Quick check to see if an we have an empty object
function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperties(prop))
      return false;
  }
  return true;
}