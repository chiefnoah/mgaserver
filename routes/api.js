var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var path = require('path');
var config = require('../util/settings_handler');
//var db = require('../util/YDBHandler')(config.getConfig().path);
var db = require('../util/database');
var forever = require('forever-monitor');

router.get("/", function(req, res, next) {
    if (req.query.cmd) {
        var cmd = req.query.cmd;
        switch (cmd) {
            case 'restart':
                console.log('restarting server...');
                //TODO: restart server
                forever.restart();
                res.redirect('/comiclist?per_page=10'); //placeholder redirect
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
    res.type('application/json');
    var queryParams = {};


    queryParams.keyphrase = req.query.keyphrase;
    queryParams.series = req.query.series;
    queryParams.path = req.query.path;
    queryParams.folder = req.query.folder;
    queryParams.title = req.query.title;
    queryParams.start_date = req.query.start_date;
    queryParams.end_date = req.query.end_date;
    queryParams.added_since = req.query.added_since;
    queryParams.modified_since = req.query.modified_since;
    queryParams.lastread_since = req.query.lastread_since;
    queryParams.character = req.query.character;
    queryParams.team = req.query.team;
    queryParams.location = req.query.location;
    queryParams.storyarc = req.query.storyarc;
    queryParams.volume = req.query.volume;
    queryParams.publisher = req.query.publisher;
    queryParams.credit = req.query.credit;
    queryParams.tag = req.query.tag;
    queryParams.genre = req.query.genre;
    queryParams.filename = req.query.filename;

    //paging params
    queryParams.order = req.query.order;
    queryParams.limit = req.query.per_page;
    queryParams.offset = req.query.offset;

    db.getComicInfo(queryParams, function(err, rows) {
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
    var params = {};
    params.id = req.params.id;
    db.getComicInfo(params, function(err, rows) {
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
    var id = req.params.id;

    db.getComicFile(id, function(err, row) {

        if (err) {
            console.log(err);
        }
        if (row) {

            row.path = path.normalize(config.getConfig().path + row.path);
            console.log("PATH: " + row.path);

            var mimeType = 'application/octet-stream';
            if (path.extname(row.path) === '.cbz') {
                mimeType = 'application/x-cbz';
            } else if (path.extname(row.path) === '.cbr') {
                mimeType = 'application/x-cdisplay';
            }

            var options = {
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true,
                    'Content-Type': mimeType,
                    'Content-Disposition': 'filename=' + path.basename(row.path)
                }
            };
            res.sendFile(row.path, options, function(err) {
                if (err) {
                    console.log(err);
                    res.status(err.status).end();
                } else {
                    console.log("Sent: " + row.path);
                }

            });
        } else {
            res.status(404).end();
            console.log("Error: Invalid ID - the db query returned nothing");
        }
    });
});

router.get('/comic/:id/thumbnail', function(req, res, next) {
    var queryParams = {};
    queryParams.id = req.params.id;
    db.getComicInfo(queryParams, function(err, rows) {
        if (err) {
            console.log(err);
        }

        if (rows[0]) {
            var thumbnailPath = path.normalize(config.getConfig().path + '/.yacreaderlibrary/covers/' + rows[0].hash + '.jpg');
            console.log(thumbnailPath);
            var mimeType = 'image/jpeg';
            var options = {
                headers: {
                    'x-timestamp': Date.now(),
                    'x-sent': true,
                    'Content-Type': mimeType,
                    'Content-Disposition': 'filename=' + rows[0].hash + '.jpg'
                }
            };
            res.sendFile(thumbnailPath, options, function(err) {
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
    res.status(404).end();
});

router.get('/folders/0/:path', function(req, res) {
    res.type('application/json');
    var path = "/" + req.params.path;
    console.log("Path: " + path);
    db.getFolders(path, function(result) {
        res.send(JSON.stringify(result));
    });
});

router.get('/folders/0:path', function(req, res) {
    res.type('application/json');
    console.log("stupid path quirks...");
    var path = querystring.unescape(req.params.path);
    console.log("Path: " + path);
    db.getFolders(path, function(result) {
        res.send(JSON.stringify(result));
    });
});

router.get('/folders/0/', function(req, res) {
    res.type('application/json');
    var path = '/';
    console.log("Path: " + path + "0");
    db.getFolders(path, function(result) {
        res.send(JSON.stringify(result));
    });
});


//TEST
router.get('/folders', function(req, res) {
    res.type('application/json');
    //TODO: NOT hardcode this
    var path = '/';
    console.log("Path: root");
    var root = {
        current: "",
        folders: [{
            url_path: "/folders/0",
            name: "root"
        }],
        comics: {
            count: 0,
            url_path: ""
        }
    };
    res.send(JSON.stringify(root));

});

router.get('/version', function(req, res) {
    res.type('application/json');
    res.send(JSON.stringify({
        server: "MgaServer v0.1",
        version: "0.0.7"
    }));
});

router.get('/dbinfo', function(req, res) {
    res.type('application/json');
    //TODO: return DB info.
    /*db.getDBInfo(function(err, dbinfo) {
        if(err) {
            res.send({error: "There was an error"});
            return;
        }
        res.send(JSON.stringify(dbinfo))
    });*/
    res.send(JSON.stringify({"comic_count": 12199, "last_updated": "2015-08-13T21:56:37.372000", "id": "f03b53dbd5364377867227e23112d3c7", "created": "2015-06-18T19:13:35.030000"}));
});


router.get('/entities[\\s\\S]*', function(req, res) {
  var params = req.params[0].split('/');
  res.send(JSON.stringify(params));
});

module.exports = router;


//Quick check to see if an we have an empty object
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperties(prop))
            return false;
    }
    return true;
}
