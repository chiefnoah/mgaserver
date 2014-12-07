module.exports = function() {
  var db = require('./database');
  var fs = require('fs');
  var config = require('../config.js');
  var path = require('path'); //for path.extname(filename)
  var walk = require('walk');

  var walker = walk.walkSync(config.path, {
    followLinks: false
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
    comicFiles.sort();
    for (var i = 0; i < comicFiles.length; i++) {
      var c = require('./comic_metadata_generator')(comicFiles[i]);
      //console.log('Adding ' + c.series_title + ' ' + c.chapter + " ID: " + c._id);
      //db.comics_dbInsert(c);
      console.log(c.series_title + ' ' + c.chapter + ' has been found at ' + c.relative_path);
      comicObjects.push(c);
    }
    //console.log(comicObjects);
    db.comics_dbInsert(comicObjects);
    //console.log(comicFiles);
    console.log("DONE!");
    return comicObjects;
  });
};