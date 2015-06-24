var sqlite = require('sqlite3').verbose();
var config = require('../config');
var db = new sqlite.Database(config.path + '/.yacreaderlibrary/library.ydb');

var settingsDB = new sqlite.Database('../settings.db');

var closeDB = function() {
    db.close();
};

var getComicInfo = function(sql, callback) {
    db.all(sql, function(err, rows) {
    	if(err) {
    		callback(err, null);
    		return;
    	}
    	for(var i = 0; i < rows.length; i++) {
    		//Translate YAC Reader Metadata into ComicStreamer Compliant data
    		rows[i].series = rows[i].volume;
    		rows[i].added_ts = "";
    		rows[i].page_count = rows[i].numPages;
    		rows[i].locations = [];

    		if(rows[i].date) {
    			var date = rows[i].date.split('/');
    			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    			rows[i].month = months[date[0] - 1];
    			rows[i].year = date[2];
    			rows[i].day = date[1];
    		}
    		
    		rows[i].deleted_ts = "";
    		rows[i].genres = [rows[i].genere];
    		rows[i].filesize = 0;//TODO: filesize

    		rows[i].issue = rows[i].number;
    		rows[i].creddits = {};
    		rows[i].generictags = []; //I can probably put some of the tags/metadata ComicStreamer doesn't support but YACReader does in here
    		rows[i].lastread_ts = "";
    		rows[i].teams = [];

    	}
    	callback(err, rows);
    });
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

var initSettingsDb = function() {

};

var getSetting = function(sql, callback) {
	db.all(sql, callback);
};

module.exports = {
    getComicInfo: getComicInfo,
    closeDB: closeDB,
    getComicFile: getComicFile,
    getDBInfo: getDBInfo,
    getFolders: getFolders,
    getFolder: getFolder

};