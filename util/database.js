    var config = require('../config');
    var Datastore = require('nedb');
    //Persistent database
    var db = {};

    db.series = new Datastore({
      filename: config.database.series_path,
      autoload: true
    });

    db.comics = new Datastore({
      filename: config.database.comics_path,
      autoload: true
    });

    db.users = new Datastore({
      filename: config.database.users_path,
      autoload: true
    });
    /*
    db.comics.ensureIndex({
      fieldName: 'series_title',
      unique: false
    }, function(err) {
      if (err) console.log(err);
    });

    db.comics.ensureIndex({
      fieldName: 'chapter',
      unique: false
    }, function(err) {
      if (err) console.log(err);
    });

    //Memory database (for faster access) DOESN'T need to be loaded
    //var mdb = new Datastore();
    //Load the databases
    db.series.loadDatabase(function(err) {
      if (err) console.log("Error loading series database: " + err);
      //This should really report the error on the webpage. I'll do it later
      //console.log("Series database succesfully loaded");
    });

    db.comics.loadDatabase(function(err) {
      if (err) console.log("Error loading comics database: " + err);
      //This should really report the error on the webpage. I'll do it later
      //console.log("Comics database succesfully loaded");
    });

    db.users.loadDatabase(function(err) {
      if (err) console.log("Error loading users database: " + err);
      //This should really report the error on the webpage. I'll do it later
      //console.log("Users database succesfully loaded");
    });
    */

    //Expects a string with the name of the database and array of data to insert into the db.
    var comics_dbInsert = function(data) {
      //console.log(data);
      db.comics.insert(data, function(err, newDoc) {
        if (err) {
          console.log(err);
          return "Data not added to database 'comics'";
        }
        for (var i = 0; i < newDoc.length; i++) {
          console.log(newDoc[i] + 'has been added to the db');
        }
        return "Data was successfully saved to comics";
      });
    };

    module.exports = {
      comics_dbInsert: comics_dbInsert
    };

    //TODO: More CRUD operations here :D