module.exports = function(callback) {
  var db = require('./database');
  var fs = require('fs');
  var config = require('../config.js');
  var path = require('path'); //for path.extname(filename)
  var walk = require('walk');
  var comicMetadataGen = require('./comic_metadata_generator');
  var comic = require('./comic_metadata');

  var walker = walk.walkSync(config.path, {
    followLinks: true
  });

  var comicFiles = [];

  walker.on('names', function(root, nodeNamesArray) {
    nodeNamesArray.sort(function(a, b) {
      if (a > b) return 1;
      if (a < a) return -1;
      return 0;
    });
  });

  walker.on('directories', function(root, dirStatsArray, next) {
    //console.log(root + '/' + dirStatsArray.name);
    next();
  });

  walker.on('file', function(root, fileStats, next) {
    //console.log(root + '/' + fileStats.name);
    if (path.extname(fileStats.name) === '.cbz') {
      comicFiles.push(root + '/' + fileStats.name);
    }
  });

  walker.on('errors', function(root, nodeStatsArray, next) {
    console.log(nodeStatsArray);
    next();
  });

  walker.on('end', function() {
    var comicObjects = [];
    var fileCount = 0;
    comicFiles.sort();

    var insertCallback = function(err, data) {
      fileCount++;
      if (err) {
        //console.log(err);
      }
      if (data) {
        comicObjects.push(data);
      }
      if (fileCount === comicFiles.length) {
        if (comicObjects.length > 0) {
          callback(comicObjects);
        } else {
          callback(null);
        }

      }
    };
    for (var i = 0; i < comicFiles.length; i++) {
      var c = new comic();
      c = comicMetadataGen(comicFiles[i]);
      db.comics_dbInsert(c, insertCallback);
    }
  });

};