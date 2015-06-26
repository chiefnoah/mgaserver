var sqlite = require('sqlite3').verbose();
var querystring = require('querystring');
var config = require('./settings_handler').getConfig();
var db = new sqlite.Database(config.path + '/.yacreaderlibrary/library.ydb');
var moment = require('moment');

var closeDB = function() {
    db.close();
};

var getComicInfo = function(params, callback) {
    var sql = "SELECT comic.id as id, hash, folder.path as folderPath, comic.path as comicPath, writer, penciller, inker, colorist, letterer, coverArtist, volume as series, title, publisher, synopsis, notes as comments, genere as genre, numPages as page_count, number as issue, currentPage as lastread_page, read, storyArc, arcNumber as volume from comic LEFT JOIN comic_info ON comic.comicInfoId=comic_info.id LEFT JOIN folder ON comic.parentId=folder.id";

    var where = "";

    where += addQueryOnScalar("comic.id", params.id);

    params.person = null;
    params.role = null;
    if (!isEmpty(params.credit)) {
        var credit_info = params.credit.split(':');
        if (credit_info[0].length != 0) {
            params.person = credit_info[0];
            if (credit_info.length > 1) {
                params.role = credit_info[1];
            }
        }
    }

    if (params.role) {
        params.role = params.role.replace("*", "%");
        if (params.person) {
            params.person = params.person.replace("*", "%");
            where += params.role + " LIKE \"" + params.person + "\" AND ";
        }
    } else if (params.person) {
        params.person = params.person.replace("*", "%");
        where += "(writer || penciller || inker || colorist || letterer || coverArtist) LIKE \"" + params.person + "\" AND ";
    }

    if (!isEmpty(params.keyphrase)) {
        params.keyphrase = "%" + params.keyphrase.replace("*", "%") + "%";
        where += "((volume || title || publisher || path || synopsis || notes || characters || storyArc) LIKE \"" + params.keyphrase + "\" AND ";
    }

    //NOTE: volume in YAC Reader and volume in ComicStreamer refer to two different values
    //YAC Reader uses volume to refer to the series title
    //ComicStreamer uses it to refer to the actual volume of the series (ie. The Amazing Spiderman Volume 2)
    //YAC Reader doesn't have a value for the volume number so I'll just query for the storyArc
    where += addQueryOnScalar("arcNumber", params.volume);
    where += addQueryOnScalar("title", params.title);

    where += addQueryOnScalar("comicPath", params.path);
    where += addQueryOnScalar("folderPath", params.folder);
    where += addQueryOnScalar("publisher", params.publisher);
    //Characters are stored in a way that can't be .split so we'll just wildcard it :P
    if (!isEmpty(params.characters)) {
        params.characters = params.characters.replace("*", "%");
        where += "characters LIKE \"" + params.characters + "\" AND ";
    }
    if (!isEmpty(params.tag)) {
        params.tag = params.tag.replace("*", "%");
        where += "(characters || synopsis || publisher || writer || coverArtist) LIKE " + params.tag + " AND ";
    }

    where += addQueryOnScalar("storyArc", params.storyarc);
    where += addQueryOnScalar("genre", params.genre);

    if (!isNaN(params.volume)) {
        where += addQueryOnScalar("volume", params.volume); //the volume column is just an alias to the arcNumber column and will likely be null
    }

    //date parsing woo hoo
    if (!isEmpty(params.start_date)) {
        var date = moment(params.start_date);
        if (date.isValid()) {
            where += addQueryOnScalar("date", date.format("DD/MM/YYYY"));
        }
    }

    //YAC Reader doesn't store any other dates so those can't be queried for :(


    //Add the where
    if (where.length > 0) {
        sql += " WHERE " + where.slice(0, -5); //slices off the trailing "AND "
    }

    //Sorting order
    if (!isEmpty(params.order)) {
        var desc = (params.order.charAt(0) === "-"); //descending order if the first character is a '-'
        var sortBy = "id";
        params.order = params.order.substring(1);
        switch (params.order) {
            case "volume":
            case "issue":
            case "date":
            case "publisher":
            case "title":
            case "path":
            case "series":
                sortBy = params.order;
                break;
            default:
                sortBy = "id";
        }

        sql += " ORDER BY " + sortBy;
        if (desc) {
            sql += " DESC";
        } else {
            sql += " ASC";
        }
    }


    //console.log("Querying with: " + sql);
    db.all(sql, function(err, rows) {
        if (err) {
            callback(err, null);
            return;
        }
        for (var i = 0; i < rows.length; i++) {
            //Translate YAC Reader Metadata into ComicStreamer Compliant data
            //Some of the fileinfo can't be retrieved without accessing the filesystem which would drastically slow down the performance (probably?)
            rows[i].added_ts = moment();
            rows[i].locations = [];
            rows[i].path = rows[i].comicPath;
            rows[i].folder = rows[i].folderPath;
            if (rows[i].storyArc !== null) {
                rows[i].storyarcs = [rows[i].storyArc];
            } else {
            	rows[i].storyArc = [];
            }

            if(rows[i].genre !== null) {
            	rows[i].genres =[rows[i].genre]
            }
            rows[i].genre += "";


            if (rows[i].date) {
                var date = rows[i].date.split('/');
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                rows[i].month = months[date[0] - 1];
                rows[i].year = date[2];
                rows[i].day = date[1];
            }

            rows[i].deleted_ts = moment();
            //rows[i].genres = [rows[i].genere];
            rows[i].filesize = 0; //TODO: filesize

            //rows[i].issue = rows[i].number;
            rows[i].creddits = {};
            rows[i].generictags = []; //I can probably put some of the tags/metadata ComicStreamer doesn't support but YACReader does in here
            rows[i].lastread_ts = moment();
            rows[i].teams = [];

            //if anything is null cast it to an empty string
            rows[i].series = rows[i].series === null ? "" : rows[i].series + "";
            rows[i].issue = rows[i].issue === null ? "" : rows[i].issue + "";
            rows[i].imprint = ""
            rows[i].title = rows[i].title === null ? "" : rows[i].title + "";
            rows[i].comments = rows[i].comments === null ? "" : rows[i].comments + "";
            rows[i].issue = rows[i].issue === null ? "" : rows[i].comments + ""; 
            rows[i].hash = rows[i].hash === null ? "" : rows[i].hash + "";
            rows[i].lastread_page = rows[i].lastread_page === null ? "" : rows[i].lastread_page + "";
            rows[i].weblink = "";
            rows[i].volume = rows[i].volume === null ? "" : rows[i].volume;
            rows[i].publisher = rows[i].publisher === null ? "" : rows[i].publisher;
        }
        callback(err, rows);
    });
};

var getComicFile = function(id, callback) {
	var sql = "SELECT path FROM comic WHERE id = " + id; 
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
        db.all("SELECT id, parentId, name, path FROM folder where parentId=" + dir.id + " AND id != 1", function(err, dirsRows) {
            if (err) {
                callback(err, null); //requires testing. Might throw error if there's no children. Have to check
                console.log("Error with children dirs: " + err);
                return;
            }
            var childrenDirs = [];
            for (var i = 0; i < dirsRows.length; i++) {
                childrenDirs.push({
                    name: dirsRows[i].name,
                    url_path: '/folders/0/' + querystring.escape(dirsRows[i].path.substring(1)) //Substring because we can't escape the first /
                });
            }
            //console.log(childrenDirs);

            //NOTE: this isn't checking for comics in the children folders, only the directory at the path arg
            db.all("SELECT * from comic WHERE parentId = " + dir.id, function(err, comicsRows) {
                if (err) {
                    calback(err, null);
                    //console.log("Error with children comics: " + err);
                    return;
                }
                var result = {
                        current: path,
                        folders: childrenDirs,
                        comics: {
                            count: comicsRows.length,
                            url_path: "/comiclist?folder=" + querystring.escape(path)
                        }
                    }
                    //console.log(result);
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



//Quick check to see if an we have an empty object
function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperties(prop))
            return false;
    }
    return true;
}

//Adapted from ComicStreamer because it's a good time saver
function addQueryOnScalar(column, filter) {
    if (filter) {
        filter = filter.replace(/\*/g, "%");
        return column + " LIKE \"" + filter + "\" AND ";
    } else {
        return "";
    }
}