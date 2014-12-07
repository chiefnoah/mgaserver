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



    db.comics.ensureIndex({
      fieldName: 'relative_path',
      unique: true
    }, function(err) {
      if (err) console.log(err);
    });

    db.series.ensureIndex({
      fieldName: 'title',
      unique: true
    }, function(err) {
      if (err) console.log(err);
    });

    //Expects array of data to insert into the db and a callback that is executed when the process has finished
    var comics_dbInsert = function(data, callback) {
      db.comics.insert(data, function(err, newDoc) {

        if (err) {
          if (callback) callback(err, null);
          return "The comics could not be inserted into the db";
        }
        if (callback) callback(null, newDoc);
      });
    };

    var comics_dbFind = function(query, callback) {
      console.log('Querying comics database for ' + query);
      db.comics.find(query, function(err, docs) {
        if (err) {
          console.log(err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, docs);
      });
    };


    //Expects array of data to insert into the db and a callback that is executed when the process has finished
    var series_dbInsert = function(data, callback) {
      db.series.insert(data, function(err, newDoc) {
        if (err) {
          //console.log("Error - data not inserted into comics db");
          if (callback) callback(err, null);
          return "The series could not be added to the db";
        }
        if (callback) callback(null, newDoc);
      });
    };







    module.exports = {
      comics_dbInsert: comics_dbInsert,
      comics_dbFind: comics_dbFind,
      series_dbInsert: series_dbInsert
    };

    //TODO: More CRUD operations here :D