module.exports = function() {
  var config = require('../config');
  var Datastore = require('nedb');
  //Persistent database
  var db = {};
  db.comics = new Datastore({
    filename: config.database.path
  });

  db.users = new Datastore({
    filename: config.database.user_path
  });
  //Memory database (for faster access) DOESN'T need to be loaded
  //var mdb = new Datastore();
  //Load the databases
  db.comics.loadDatabase(function(err) {
    if (err) console.log("Error loading comics database");
    //This should really report the error on the webpage. I'll do it later
    console.log("Comics database succesfully loaded");
  });

  db.users.loadDatabase(function(err) {
    if (err) console.log("Error loading users database");
    //This should really report the error on the webpage. I'll do it later
    console.log("Users database succesfully loaded");
  });

  //All functions that I want to be accessable to the database object must be inside the return statement here
  return {
    //Expects and array of data to insert into the db.
    dbInsert: function(data) {
      db.insert(data, function(err, newDoc) {
        if (err) console.log(err);
        for (var i = 0; i < newDoc.length; i++) {
          console.log(newDoc[i] + 'has been added to the db');
        }
      });
    }

    //TODO: More CRUD operations here :D


  };
};