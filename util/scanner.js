module.exports = function() {

  var fs = require('fs');
  var config = require('../config.js');
  var path = require('path'); //for path.extname(filename)
  //TODO: Scan directory for cbz and cbr files

  var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

  walk(config.path, function(err, results) {
    if (err) console.log(err);
    console.log(results);
  });

};