var CREATE_FOLDER = "CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, name TEXT NOT NULL, path TEXT UNIQUE NOT NULL, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE)";
var CREATE_COMIC = "CREATE TABLE IF NOT EXISTS comic(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, comicInfoId INTEGER NOT NULL, fileName TEXT NOT NULL, path TEXT NOT NULL, absolute_path TEXT NOT NULL, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id))";
var CREATE_COMIC_INFO = "CREATE TABLE IF NOT EXISTS comic_info(id INTEGER PRIMARY KEY, title TEXT, series TEXT, issue_number REAL, page_count INTEGER, filesize INTEGER, credits TEXT, volume TEXT, genres TEXT, date_added INTEGER, publish_date INTEGER, synopsis TEXT, characters TEXT, date_last_read INTEGER, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, last_read_page INTEGER DEFAULT 0, rating INTEGER DEFAULT 0, status TEXT, bookmarks TEXT, other TEXT, hash TEXT UNIQUE NOT NULL)";
var CREATE_USERS = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, password TEXT, api_keys TEXT)";
var CREATE_PROGRESS = "CREATE TABLE IF NOT EXISTS progress(id INTEGER PRIMARY KEY, comicInfoId INTEGER NOT NULL, userId INTEGER NOT NULL, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, date_last_read INTEGER, date_completed INTEGER, last_read_page INTEGER DEFAULT 0, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)";
var CREATE_DB_INFO = "CREATE TABLE IF NOT EXISTS db_info(db_version TEXT NOT NULL, comic_streamer_compat TEXT NOT NULL, comic_count INTEGER DEFAULT 0, last_updated TEXT, created TEXT)";
var STARTUP = "PRAGMA foreign_keys = ON; VACUUM";


var sqlite = require('sqlite3').verbose();
var config = require('./settings_handler').getConfig();


//Initialize the database
var init = function() {
  console.log("Initializing database");

  this._db = new sqlite.Database('./library.mdb'); //Creates the database file inside the install directory
  this._db.serialize();
  //TODO: create indices for querying faster
  this._db.run(STARTUP);
  this._db.run(CREATE_FOLDER);
  this._db.run(CREATE_COMIC_INFO);
  this._db.run(CREATE_COMIC);
  this._db.run(CREATE_USERS);
  this._db.run(CREATE_ROOT_FOLDER);
}

//Sets comic info
var updateComic = function(params, callback) {
  var sql = "UPDATE comic_info "; //TODO: finish this
}

var addComic = function(params, callback) {
  //Creates a reference to a comic file
  var INSERT_COMIC_INFO = "INSERT OR IGNORE INTO comic_info(filesize, date_added, hash) VALUES($filesize, $date_added, $hash);"
  var INSERT_COMIC = "INSERT OR IGNORE INTO comic(parentId, comicInfoId, fileName, path) VALUES ((SELECT id FROM folder WHERE path = $parentDir), $comicInfoId, $filename, $path)"
  var comic_info_params = {
    $filsize: params.filesize,
    $date_added: (new Date).getTime(),
    $hash: params.hash
  }
  this._db.run(INSERT_COMIC_INFO, comic_info_params, function(err) {
    if (err) {
      console.log("Could not create comic info");
      callback(err);
      return;
    }
    console.log("created comic info");
    var comicInfoId = this.lastID;
    console.log(comicInfoId);
    var comic_params = {
      $comicInfoId: comicInfoId,
      $filename: params.filename,
      $path: params.path,
      $parentDir: params.parentDir
    }
    this._db.run(INSERT_COMIC, comic_params, function(err) {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  });
}

var getComicInfo = function(params, callback) {

}

var closeDB = function() {

}

var getDBInfo = function() {
  this._db.get("SELECT * FROM db_info", callback);
}

var getFolders = function(path, callback) {

}

var addFolder = function(params, callback) {
  var sql = "INSERT OR IGNORE INTO folder(parentId, name, path) VALUES((SELECT id FROM folder WHERE path = $parentDir), $name, $path)";
  this._db.run(sql, params, function(err) {
    callback(err, this.changes);
  });
}

var getUser = function(params, callback) {

}

var getProgress = function(params, callback) {

}

var addUser = function(userParams, callback) {

}

var setProgress = function(params, callback) {

}

module.exports = {
  init: init,
  addFolder: addFolder,
  addComic: addComic,
  addBaseFolder: addBaseFolder
};





//SQLITE STATEMENTS
//CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, path TEXT NOT NULL, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE)

//CREATE TABLE IF NOT EXISTS comic(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, comicInfoId INTEGER NOT NULL, fileName TEXT NOT NULL, path TEXT, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id))
