var config = require('./settings_handler').getConfig();
var fs = require('fs');
var path = require('path');

var databases = [];

//TODO: determine which backend we're using and deside which database handler(s) to load
for (var i = 0; i < config.paths.length; i++) {
    var p = path.normalize(config.paths[i] + '/.yacreaderlibrary/library.ydb');
    //Using synchronous cause this is startup and will only be called once.
    if (fs.existsSync(p)) {
        console.log("Found a YAC Database at " + p);
        databases.push({
            type: "yac",
            path: p,
            db: require('./YDBHandler')(p)
        }); //Creates a new reference to the database
    } else {
        databases.push({
            type: "monitored",
            path: p,
            db: require('MGADBHandler')(p)
        });
    }
}

var getComicInfo = function(params, callback) {

};

var closeDB = function() {
    //perform cleanup functions here
    for (var i = 0; i < paths.length; i++) {

    }
}

var getComicFile = function(id, callback) {
    for (var i = 0; i < paths.length; i++) {

    }
}

var getDBInfo = function(callback) {
    var output = "Num of databases: " + databases.length + "\n"
    for (var i = 0; i < databases.length; i++) {
        databases[i].db.getDBInfo(function(err, row) {
            output += "\nDatabase #" + i + " version: " + row.version;
            callback(output);
        });
    }
    //callback(output);
}

var getFolders = function(path, callback) {
    for (var i = 0; i < paths.length; i++) {

    }
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