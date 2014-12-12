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

    db.users.ensureIndex({
      fieldName: 'username',
      unique: true
    }, function(err) {
      if (err) console.log(err);
    });

    module.exports = {
      series: db.series,
      comics: db.comics,
      users: db.users
    };

    //TODO: More CRUD operations here :D