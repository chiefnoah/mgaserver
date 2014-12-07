module.exports = {
  //Name of the server
  name: 'Mga Server',
  //Port the server will run on
  port: '3000',
  //Path to directory containing the .cbz and .cbr files
  path: './Comics', //"../../../../../Volumes/FreeAgent Drive/NOAH'S/eBooks/eComics",


  database: {
    //This is the path to where the database is stored
    //You probably don't need to change this
    series_path: './db/mga-series-0.db',
    comics_path: './db/mga-comics-0.db',
    users_path: './db/users-0.db'
  },
  //TODO: Add more config options

  //Define users here. The default user
  users: [{
    name: 'noah',
    password: '11noah',
    sync: false, //Syncronize comic read data
    admin: true
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