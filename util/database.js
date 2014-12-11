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
      //console.log('Querying comics database for ' + query);
      db.comics.find(query, function(err, docs) {
        if (err) {
          console.log('DB ERROR: ' + err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, docs);
      });
    };

    var comics_dbFindOne = function(query, callback) {
      //console.log('Querying comics database for ' + query);
      db.comics.findOne(query, function(err, doc) {
        if (err) {
          console.log('DB ERROR: ' + err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, doc);
      });
    };

    var comics_dbRemove = function(query, options, callback) {
      //console.log('Querying comics database for ' + query);
      db.comics.remove(query, options, function(err, numRemoved) {
        if (err) {
          console.log('DB ERROR: ' + err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, numRemoved);
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


    var series_dbFind = function(query, callback) {
      //console.log('Querying comics database for ' + query);
      db.series.find(query, function(err, docs) {
        if (err) {
          console.log(err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, docs);
      });
    };


    var series_dbFindOne = function(query, callback) {
      //console.log('Querying comics database for ' + query);
      db.series.findOne(query, function(err, docs) {
        if (err) {
          console.log(err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, docs);
      });
    };

    var series_dbRemove = function(query, options, callback) {
      //console.log('Querying comics database for ' + query);
      db.series.remove(query, options, function(err, numRemoved) {
        if (err) {
          console.log('DB ERROR: ' + err);
          if (callback) callback(err, null);
        }
        if (callback) callback(null, numRemoved);
      });
    };



    module.exports = {
      comics_dbInsert: comics_dbInsert,
      comics_dbFind: comics_dbFind,
      series_dbInsert: series_dbInsert,
      series_dbFind: series_dbFind,
      comics_dbFindOne: comics_dbFindOne,
      series_dbFindOne: series_dbFindOne,
      series_dbRemove: series_dbRemove,
      comics_dbRemove: comics_dbRemove,
      series: db.series,
      comics: db.comcis,
      users: db.users
    };

    //TODO: More CRUD operations here :D