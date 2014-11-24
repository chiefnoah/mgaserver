module.exports = function() {
  var config = require('../config');
  var Datastore = require('nedb');
  //Persistent database
  var db = new Datastore({
    filename: config.database.path
  });
  //Memory database (for faster access) DOESN'T need to be loaded
  //var mdb = new Datastore();
  //Load the database
  db.loadDatabase(function(err) {
    if (err) console.log("Error loading database");
    //This should really report the error on the webpage. I'll do it later
    console.log("Database succesfully loaded");
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
