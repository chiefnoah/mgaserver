var http = require('http');
var config = require('../../config');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;
var Manga = require('../series_metadata');
var fs = require('fs');
var request = require('request');
var path = require('path');


var search_manga = function(series_title, callback) {
  //See http://myanimelist.net/modules.php?go=api for details regarding the API

  var stringQuery = series_title.replace(/\s/g, '+');
  var result = new Manga();

  var options = {
    hostname: 'myanimelist.net',
    path: '/api/manga/search.xml?q=' + stringQuery,
    method: 'GET',
    auth: config.scrapers.myanimelist.username + ':' + config.scrapers.myanimelist.password
  };

  http.get(options, function(res) {

    if (res.statusCode === 200) {
      //console.log('Search query: ' + series_title + ' found data!');
      var xmlOutput = '';
      res.on('data', function(chunk) {
        xmlOutput += chunk;
      });

      res.on('end', function() {
        parseString(xmlOutput, function(err, res) {
          findBestResult(res.manga.entry);
          callback(result);
        });
      });
    } else if (res.statusCode === 204) {
      //console.log('Search query: ' + series_title + ' found nothing');
      result.title = series_title;
      result.cover = '/images/default.png';
      result.start_date = '';
      result.end_date = '';
      result.authors = [''];
      result.artists = [''];
      result.publisher = '';
      result.status = 'unknown';
      result.genres = [''];
      result.aliases = [series_title];
      result.rating = 0.0;
      result.chapters = 0;
      result.volumes = 0;
      result.description = 'Not available';
      callback(result);
    }
  }).on('error', function(err) {
    console.log('ERROR: ' + err.message);
  });


  function findBestResult(objectList) {
    for (i = 0; i < objectList.length; i++) {
      var reg = new RegExp(series_title, 'i');
      if ((objectList[i].title[0].search(reg) > -1) && (objectList[i].type[0] === 'Manga' || objectList[i].type[0] === '')) {
        var mData = objectList[i];
        result.title = series_title;
        result.cover = saveCover(mData.image[0]);
        result.start_date = mData.start_date[0];
        result.end_date = mData.end_date[0];
        result.authors = [''];
        result.artists = [''];
        result.publisher = '';
        result.status = mData.status[0];
        result.genres = ['Manga'];
        result.description = mData.synopsis[0];
        result.chapters = mData.chapters[0];
        result.volumes = mData.volumes[0];
        result.rating = mData.score[0];
        this.aliases = mData.synonyms;
      }
    }

    function saveCover(imageURL) {
      var fileURI = './public/images/series/' + path.basename(imageURL);
      //console.log('downloading ' + imageURL + ' to ' + fileURI);

      var download = function(uri, filename, callback) {
        request.head(uri, function(err, res, body) {
          //console.log('content-type:', res.headers['content-type']);
          //console.log('content-length:', res.headers['content-length']);

          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };



      download(imageURL, fileURI, function() {
        //console.log('saved ' + imageURL + ' to ' + fileURI);
      });
      return fileURI;
    }

  }
};

module.exports = {
  search: search_manga
};