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