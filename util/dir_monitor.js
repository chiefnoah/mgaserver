module.exports = function(dir) {
  var chokidar = require('chokidar');
  var mPath = require('path');
  var _ = require('underscore');
  var db = require('./database');
  var comic_gen = require('./comic_metadata_generator');
  var myanimelistscraper = require('./scrapers/myanimelist');

  var comicFiles = [];
  var seriesInFiles = [];

  //Ignores all files that don't have a cbr/cbz extension
  var watcher = chokidar.watch(dir, {
    ignored: /[\/\\]\./, //ignores all files that start with a .
    persistent: true
  });
  //console.log('Monitoring ' + dir + ' for file changes');


  watcher.on('add', function(path) {
    //console.log(path + ' was added');

    if (mPath.extname(path) === '.cbz' || mPath.extname(path) === '.cbr') {
      var c = comic_gen(path);
      comicFiles.push(path);
      seriesInFiles.push(c.series_title);
      //console.log('saving ' + path + ' to db');
      db.comics_dbInsert(c);
    }
  });

  watcher.on('unlink', function(path) {
    console.log('File', path, 'has been removed');

    if (mPath.extname(path) === '.cbz' || mPath.extname(path) === '.cbr') {
      db.comics_dbRemove({
        relative_path: path
      }, {
        multi: true
      }, function(err, numRemoved) {
        if (err) console.log(err);
        console.log(numRemoved);
      });
    }
  });

  watcher.on('error', function(err) {
    conole.log(err);
  });

  var scrapperCallback = function(result) {
    db.series_dbInsert(result);
  };

  watcher.on('ready', function() {
    seriesInFiles.sort();
    seriesInFiles = _.uniq(seriesInFiles, true);
    //console.log(seriesInFiles);

    removeMissingFiles();
    for (var i = 0; i < seriesInFiles.length; i++) {
      myanimelistscraper.search(seriesInFiles[i], scrapperCallback);
    }
    console.log('Initial scan complete. Ready for file changes...');
  });

  //Loops through the files that were just scanned and removes them from the database if they weren't there
  function removeMissingFiles() {
    db.comics_dbFind({}, function(err, data) {
      var pathsSaved = [];

      for (var i = 0; i < data.length; i++) {
        pathsSaved.push(data[i].relative_path);
      }
      var toRemove = _.difference(pathsSaved, comicFiles);
      var removeCallback = function(err, numRemoved) {
        if (err) console.log(err);
        //console.log(numRemoved);
      };


      for (var z = 0; z < toRemove.length; z++) {
        //console.log('removing ' + toRemove[z]);
        db.comics_dbRemove({
          relative_path: toRemove[z]
        }, {}, removeCallback);
      }
      //console.log('done removing');
    });
  }



  function removeMissingSeries() {
    //TODO: code for removing series that no longer have files
  }

};