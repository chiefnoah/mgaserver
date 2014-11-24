module.exports = {
  //Name of the server
  name: 'Mga Server',
  //Port the server will run on
  port: '3000',
  //Path to directory containing the .cbz and .cbr files
  path: './Comics/',


  database: {
    //This is the path to where the database is stored
    //You probably don't need to change this
    path: './db/mga-1.db',
    user_path: './db/users.db'
  },
  //TODO: Add more config options

  //Define users here. The default user
  users: [{
    name: 'default',
    password: 'password',
    sync: false, //Syncronize comic read data

  }]

};