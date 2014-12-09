module.exports = function(dir, callback) {
  var db = require('./database');
  var fs = require('fs');
  var config = require('../config');
  var path = require('path'); //for path.extname(filename)
  var walk = require('walk');
  var comicMetadataGen = require('./comic_metadata_generator');
  var comic = require('./comic_metadata');
  var _ = require('underscore');
  var myanimelistscraper = require('./scrapers/myanimelist');

  var walker = walk.walkSync(dir, {
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
    var seriesList = [];
    var fileCount = 0;
    comicFiles.sort();

    var insertComicsCallback = function(err, data) {
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
      seriesList.push(c.series_title);
      db.comics_dbInsert(c, insertComicsCallback);
    }

    var scrapperCallback = function(result) {
      db.series_dbInsert(result);
    };


    //Series Generator
    seriesList.sort(); //Sorts the list of series
    seriesList = _.uniq(seriesList, true); //Removes repeats
    for (var z = 0; z < seriesList.length; z++) {
      myanimelistscraper.search(seriesList[z], scrapperCallback);
    }
  });

};