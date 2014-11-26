module.exports = {
  //Name of the server
  name: 'Mga Server',
  //Port the server will run on
  port: '3000',
  //Path to directory containing the .cbz and .cbr files
  path: './Comics',


  database: {
    //This is the path to where the database is stored
    //You probably don't need to change this
    series_path: './db/mga-0.db',
    comics_path: './db/mga-1.db',
    users_path: './db/users.db'
  },
  //TODO: Add more config options

  //Define users here. The default user
  users: [{
    name: 'default',
    password: 'password',
    sync: false, //Syncronize comic read data

  }],

  scrapers: {
    myanimelist: {
      username: 'chiefnoah',
      password: '11noah',

      request_url: 'http://myanimelist.net/api/manga/search.xml',
      requst_variable: 'q'
        //See http://myanimelist.net/modules.php?go=api for details regarding the API
    },

    comicvine: {
      //TODO: Add stuff for comicvine scraper API
    }
  }

};