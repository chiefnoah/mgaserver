module.exports = function() {
  return {
    "id": 0, //Identification ID for the comic issue/file

    "title": "", //Title of the individual comic issue
    "series": "", //Series title
    "issue_number": 0, //The issue number of the individual comic/issue. Usually used for sorting and reading order. Supports decimals (ie. 16.5)

    "page_count": 0, //number of pages/images in the archive

    "filesize": 0, //Size of the file in bytes

    //Credits. Pretty self explanitory
    "credits": {
      "author": "",
      "artist": "",
      "publisher": "",
      "other": [""] //Formatted "job:name" stored in the database as such
    },

    "volume": "", //Name of the volume. Used for grouping. I don't expect this to be used too often.

    "genres": ["", ""], //Genres. Pretty self explanitory

    //DATES! :D
    "date_added" : 0, //Date added to the database. Stored as UNIX timestamp
    "publish_date": 0, //Date published

    "synopsis": "", //Pretty self explanitory
    "characters": [], //array of character names foramatted "[character name];[character name]"

    //Progress tracking. I will probably move these to a separate table for multi-user support.
    "date_last_read": 0, //Date last read
    "read": false, //Whether the comic has been opened (not necessarily completed)
    "completed": false,
    "last_read_page": 0, //Page number of the last read page


    "rating": 0, //Assumed to be out of 10

    "status": "", //Publishing statis (ie. completed, ongoing, etc.)

    "bookmarks": [], //Bookmarked page integer foramatted in the database as "1;2;3"

    "other":[] //Other tags are formatted "[tagname]:[tag]"
    
  }
}


//SQLITE STATEMENT:
//CREATE TABLE IF NOT EXISTS comic_info(id INTEGER PRIMARY KEY, title TEXT, series TEXT, issue_number REAL, page_count INTEGER, filesize INTEGER, credits TEXT, volume TEXT, genres TEXT, date_added INTEGER, publish_date INTEGER, synopsis: TEXT, characters TEXT, date_last_read INTEGER, read INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, last_read_page INTEGER DEFAULT 0, rating INTEGER DEFAULT 0, status TEXT, bookmarks TEXT, other TEXT)