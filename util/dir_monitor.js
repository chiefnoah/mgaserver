var chokidar = require('chokidar');
var hashFiles = require('hash-files');
var fs = require('fs');
var mPath = require('path');
//var config = require('./settings_handler').getConfig();
var db = require('./database');

module.exports = function(base_dir) {
  console.log("monitoring: " + base_dir);

  var watcher = chokidar.watch(base_dir, {
    ignored: /[\/\\]\./, //ignores all files/folders that start with a .
    persistent: true,
    cwd: base_dir
  });
  watcher.on('add', function(path, stats) {
    if (mPath.extname(path) === '.cbz' || mPath.extname(path) === '.cbr') {
      //console.log("Found comic!: " + path);
      var path_dirs = mPath.dirname(path).split(mPath.sep);
      //console.log("Dir: " + mPath.dirname(path));
      //console.log("Path dirs: " + JSON.stringify(path_dirs) + "\nFile: " + filename);
      //loop through all folders in path_dirs except for the last, as the last
      //is the file which should be added to the comic table
      var currentPath = base_dir;
      for (var i = 0; i < path_dirs.length; i++) {
        currentPath = mPath.join(currentPath, path_dirs[i]);
        //console.log(currentPath);
        var dir_params = {
          $parentDir: mPath.dirname(currentPath),
          $name: mPath.basename(currentPath),
          $path: mPath.normalize(currentPath)
        }
        //console.log(JSON.stringify(params));
        db.addFolder(dir_params, function(err) {
          if(err) console.log("There was an error adding folder to DB: " + err);
        });
      }
      var c_params = {
        filesize: stats.size,
        date_added: new Date().getTime().toString(),
        parentDir: mPath.dirname(path),
        path: path
        //hash: hashFiles.sync({files: [mPath.join(base_dir, path)], noGlob: true})
      }
      console.log(JSON.stringify(c_params));
      db.addComic(c_params, function(err) {
        if(err) console.log("Error inserting comic into db: " + err);
      })

    }
  }).on('unlink', function(path) {
    if (mPath.extname(path) === '.cbz' || mPath.extname(path) === '.cbr') {
      //TODO: remove comic file from database
    }
  }).on('ready', function() {
    console.log("Done scanning");
  });
};
