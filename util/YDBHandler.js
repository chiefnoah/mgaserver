var sqlite = require('sqlite3').verbose();
var config = require('./settings_handler').getConfig();
var db = new sqlite.Database(config.path + '/.yacreaderlibrary/library.ydb');

var closeDB = function() {
    db.close();
};

var getComicInfo = function(params, callback) {
    var sql = "SELECT * FROM comic_info AS I JOIN comic AS C ON I.id=C.comicInfoId";
    if (params && params.length > 0) {
        sql += " WHERE ";
    }
    for (var i = 0; i < params.length; i++) {
        sql += params[i] + " AND ";
    }

    db.all(sql, function(err, rows) {
        if (err) {
            callback(err, null);
            return;
        }
        for (var i = 0; i < rows.length; i++) {
            //Translate YAC Reader Metadata into ComicStreamer Compliant data
            rows[i].series = rows[i].volume;
            rows[i].added_ts = "";
            rows[i].page_count = rows[i].numPages;
            rows[i].locations = [];

            if (rows[i].date) {
                var date = rows[i].date.split('/');
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                rows[i].month = months[date[0] - 1];
                rows[i].year = date[2];
                rows[i].day = date[1];
            }

            rows[i].deleted_ts = "";
            rows[i].genres = [rows[i].genere];
            rows[i].filesize = 0; //TODO: filesize

            rows[i].issue = rows[i].number;
            rows[i].creddits = {};
            rows[i].generictags = []; //I can probably put some of the tags/metadata ComicStreamer doesn't support but YACReader does in here
            rows[i].lastread_ts = "";
            rows[i].teams = [];

        }
        callback(err, rows);
    });
};

var getComicFile = function(params, callback) {
    db.get(sql, callback);
};

var getDBInfo = function(callback) {
    db.get("SELECT * FROM db_info", callback);
};

//Handle ComicStreamer compatibility conversion here cause it's really complex and requires multiple DB queries
//There has got to be a better way to do this without using nested DB queries like this
//path must never be null. Should default to '/' if not querying for a subdirectory
var getFolders = function(path, callback) {
    var sql = "SELECT * FROM folder WHERE path = \"" + path + "\""; //
    db.get(sql, function(err, dir) {
        if (err || !dir) {
            callback(err, null); //die if there was an sql error, cause that's how ComicStreamer handles it. Maybe I'll change this later
            console.log("Error with path: " + err);
            return;
        }
        db.all("SELECT id, parentId, name, path FROM folder where parentId=" + dir.id, function(err, dirsRows) {
            if (err) {
            	callback(err, null); //requires testing. Might throw error if there's no children. Have to check
            	console.log("Error with children dirs: " + err);
            	return;
            }
            var childrenDirs = [];
            for (var i = 0; i < dirsRows.length; i++) {
            	childrenDirs.push({
            		name: dirsRows[i],
            		url_path: '/folders/0/' + dirsRows[i].path
            	});
            }
            console.log(childrenDirs);

            //NOTE: this isn't checking for comics in the children folders, only the directory at the path arg
            db.all("SELECT * from comic WHERE parentId = " + dir.id, function(err, comicsRows) {
            	var result = {
            		current: path,
            		folders: childrenDirs,
            		comics: {
            			count: comicsRows.length,
            			url_path: "/comiclist?folder=" + path //TODO: URL encode this
            		}
            	}
            	console.log(result);
            	callback(result);
            });
        })
    });
};




module.exports = {
    getComicInfo: getComicInfo,
    closeDB: closeDB,
    getComicFile: getComicFile,
    getDBInfo: getDBInfo,
    getFolders: getFolders

};