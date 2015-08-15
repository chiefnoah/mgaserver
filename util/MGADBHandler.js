var CREATE_FOLDER = "CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, path TEXT NOT NULL, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE)";
var CREATE_COMIC = "CREATE TABLE IF NOT EXISTS comic(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, comicInfoId INTEGER NOT NULL, fileName TEXT NOT NULL, path TEXT, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id))";
var CREATE_COMIC_INFO = "CREATE TABLE IF NOT EXISTS comic_info(id INTEGER PRIMARY KEY, title TEXT, series TEXT, issue_number REAL, page_count INTEGER, filesize INTEGER, credits TEXT, volume TEXT, genres TEXT, date_added INTEGER, publish_date INTEGER, synopsis: TEXT, characters TEXT, date_last_read INTEGER, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, last_read_page INTEGER DEFAULT 0, rating INTEGER DEFAULT 0, status TEXT, bookmarks TEXT, other TEXT)";
var CREATE_USERS = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, password TEXT, api_keys TEXT)";
var CREATE_PROGRESS = "CREATE TABLE IF NOT EXISTS progress(id INTEGER PRIMARY KEY, comicInfoId INTEGER NOT NULL, userId INTEGER NOT NULL, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, date_last_read INTEGER, date_completed INTEGER, last_read_page INTEGER DEFAULT 0, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)";

var CREATE_DB_INFO = "CREATE TABLE IF NOT EXISTS db_info(db_version TEXT NOT NULL, comic_streamer_compat TEXT NOT NULL, "


module.exports = function(path) {
	var sqlite = require('sqlite3').verbose();

	var db = new sqlite.Database('./library.mdb'); //Creates the database file inside the install directory

	db.run(CREATE_FOLDER);
	db.run(CREATE_COMIC_INFO);
	db.run(CREATE_COMIC);
	db.run(CREATE_USERS);










	return {

	};


}





//SQLITE STATEMENTS
//CREATE TABLE IF NOT EXISTS folder(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, path TEXT NOT NULL, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE)

//CREATE TABLE IF NOT EXISTS comic(id INTEGER PRIMARY KEY, parentId INTEGER NOT NULL, comicInfoId INTEGER NOT NULL, fileName TEXT NOT NULL, path TEXT, FOREIGN KEY(parentId) REFERENCES folder(id) ON DELETE CASCADE, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id))