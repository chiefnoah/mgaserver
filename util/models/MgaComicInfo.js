module.exports = function() {
  return {
    "id": 0, //Identification ID for the comic issue/file

    "title": "", //Title of the individual comic issue
    "series": "", //Series title
    "issue_number": 0, //The issue number of the individual comic/issue. Usually used for sorting and reading order

    "page_count": 0, //

    //Credits. Pretty self explanitory
    "credits": {
      "author": "",
      "artist": "",
      "publisher": "",*
      "other": [""] //I haven't decided if this should be an associative array or just an array of strings
    },

    "volume": "", //Name of the volume. Used for grouping. I don't expect this to be used too often.

    "genres": ["", ""], //Genres. Pretty self explanitory

    //DATES! :D
    "date_added" : 0, //Date added to the database. Stored in a 
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