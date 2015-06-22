var sqlite = require('sqlite3').verbose();
var config = require('../config');
var db = new sqlite.Database(config.path + '/.yacreaderlibrary/library.ydb');

var closeDB = function() {
    db.close();
};

var getComicInfo = function(sql, callback) {
    db.all(sql, callback);
};

var getComicFile = function(sqlParams, callback) {
    db.get(sql, callback);
};

var getDBInfo = function(callback) {
    db.get("SELECT * FROM db_info", callback);
};

var getFolders = function(callback) {
    db.all("SELECT * FROM folder", callback);
};

var getFolder = function(path, callback) {
    db.all("SELECT * FROM folder WHERE path=" + path, callback);
};

module.exports = {
    getComicInfo: getComicInfo,
    closeDB: closeDB,
    getComicFile: getComicFile,
    getDBInfo: getDBInfo,
    getFolders: getFolders,
    getFolder: getFolder

};