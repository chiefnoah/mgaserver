module.exports = {
  //Name of the server
  name: 'Mga Server',
  //Port the server will run on
  port: '3000',
  //Path to directory containing the.cbz and.cbr files
  //path: './Comics',
  //path: 'F:/Development/NodeJS/mgaserver/Comics',
  path: 'F:/eBooks/eComics',
  //path: "/Volumes/FreeAgent Drive/NOAH'S/eBooks/eComics",
  password_protect: false,

  use_api_key: false,

  api_keys: [
    ""
  ],


  //Define users here. The default user
  users: [{
    username: 'noah',
    password: 'password'
  }],

  scrapers: {
    myanimelist: {
      username: 'chiefnoah',
      password: 'password',
    },

    comicvine: {
      //TODO: Add stuff for comicvine scraper API
    }
  }
};