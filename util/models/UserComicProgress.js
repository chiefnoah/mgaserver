module.exports = function() {
	return {
		"id": 0,
		"comic_info_id": 0, //Foreign key for the comic info this refers to
		"read": false, //Whether the user has opened the file at some point or not
		"completed": false, //Whether the user has gotten to the end of the comic
		"date_last_read": 0, //Date (in UNIX time) when the user last oppened the comic
		"date_completed": 0, //Date the user finished reading the comic
		"last_read_page": 0 //Page number of the last read page.
	};
};

//SQLITE STATEMENT
//CREATE TABLE IF NOT EXISTS [user](id INTEGER PRIMARY KEY, comicInfoId INTEGER NOT NULL, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, date_last_read INTEGER, date_completed INTEGER, last_read_page INTEGER DEFAULT 0, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id) ON DELETE CASCADE)

//CREATE TABLE IF NOT EXISTS progress(id INTEGER PRIMARY KEY, comicInfoId INTEGER NOT NULL, userId INTEGER NOT NULL, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, date_last_read INTEGER, date_completed INTEGER, last_read_page INTEGER DEFAULT 0, FOREIGN KEY(comicInfoId) REFERENCES comic_info(id) ON DELETE CASCADE, FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE)