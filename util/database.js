var config = require('./settings_handler').getConfig();
var fs = require('fs');
var path = require('path');


//TODO: determine which backend we're using and deside which database handler to load
for (var i = 0; i < config.paths.length; i++) {
    var p = path.normalize(config.paths[i] + '/.yacreaderlibrary/library.ydb');
    //Using synchronous cause this is startup and will only be called once.
    if (fs.existsSync(p)) {
        console.log("Found a YAC Database at " + p);
        var db = require('YDBHandler')(p);
    } else {
        var db = require('MGADBHandler')(p);
    }
}

var getComicInfo = function(params, callback) {

};

var closeDB = function() {
    //perform cleanup functions here
}

var getComicFile = function(id, callback) {

}

var getDBInfo = function(callback) {
    if(db) {
        db.getDBInfo(function(err, row) {
            callback(err, row);
        });
    }
}

var getFolders = function(path, callback) {

}

var setProperties = function(params) {


}

module.exports = {
    getComicInfo: getComicInfo, //Returns comic metadata based on the query
    closeDB: closeDB, //Closes the database and other cleanup
    getComicFile: getComicFile, //returns the absolute path to a comic file based on the ID
    getDBInfo: getDBInfo, //Returns info on the database such as version number
    getFolders: getFolders, //Returns the folders
    setProperties: setProperties
};