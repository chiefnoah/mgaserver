var express = require('express'),
  router = express.Router(),
  config = require('../config.js');
var db = require('../util/database');



module.exports = function(passport) {

  router.get('/', passport.authenticate('local', {
    session: false
  }), function(req, res) {
    db.series.find({}, function(err, data) {
      for (var i = 0; i < data.length; i++) {
        var cPath = data[i].cover;
        if (cPath) data[i].cover = cPath.substring(cPath.search(/\/images/i));
        //console.log(data[i].cover);
      }
      var output = {
        series: data
      };
      console.log(data.length);
      //console.log('Data: ' + data[0].title);
      res.render('series', output);
      //res.write('derp');
      //res.send(data.toString());
    });

    //res.write('<p>test</p>');
  });
  return router;
};

//module.exports = router;