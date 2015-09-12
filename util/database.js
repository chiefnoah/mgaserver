var config = require('./settings_handler').getConfig();
var fs = require('fs');
var path = require('path');

var db = {};
//This is basically the constructor of the database object. It MUST be called
//before anything else can be done
var init = function() {
  db = require('./MGADBHandler');
  db.init();
  //TODO: determine which backend we're using and deside which database handler to load
  for (var i = 0; i < config.paths.length; i++) {
    console.log("initializing dir monitor for " + config.paths[i]);
    var dir_monitor = new require('./dir_monitor')(config.paths[i]);
    var params = {
      $name: path.basename(config.paths[i]),
      $path: path.normalize(config.paths[i])
    }
    db.addBaseFolder(params, function(err) {
      if(err) console.log("Error: " + err);
    });
  }
}

var getComicInfo = function(params, callback) {
  db.getComicInfo(params, callback);
};

var closeDB = function() {
  //perform cleanup functions here

}

var getComicFile = function(id, callback) {
  db.getComicFile(id, callback);
}

var getDBInfo = function(callback) {
  if (db) {
    db.getDBInfo(function(err, row) {
      callback(err, row);
    });
  }
}

var getFolders = function(path, callback) {
  if (db) {
    db.getFolders(path, callback);
  }

}

var addFolder = function(params, callback) {
  db.addFolder(params, callback);
}

var setProperties = function(params) {

}

var addComic = function(params, callback) {
  //TODO: some sort of error handling for when this is a YACReader database
  if (db) {
    db.addComic(params, callback);
  }
}

//This is stupid, I put this up here in it's own var so I can
//pass a reference to it to the dir_monitor
module.exports = {
  init: init, //initialization function
  getComicInfo: getComicInfo, //Returns comic metadata based on the query
  closeDB: closeDB, //Closes the database and other cleanup
  getComicFile: getComicFile, //returns the absolute path to a comic file based on the ID
  getDBInfo: getDBInfo, //Returns info on the database such as version number
  getFolders: getFolders, //Returns the folders
  setProperties: setProperties,
  addComic: addComic,
  addFolder: addFolder
}
