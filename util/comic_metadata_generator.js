module.exports = function(path) {
  var Comic = require('./comic_metadata');

  var comic = new Comic();
  var info = [];
  info = path.split('/');

  comic.relative_path = path.replace(/^.\/Comics/, "");
  comic.series_title = info[info.length - 2];
  comic.media_type = info[info.length - 3];
  comic.chapter = findChapter(info[info.length - 1]);

  function findChapter(fileName) {
    var name = fileName;
    name = name.substring(0, fileName.lastIndexOf('.'));
    re = /[0-9]+/;
    if (re.test(name)) {
      name = name.replace(/^[^0-9]+/g, ""); //Removes all letters from string
      name = name.replace(/\s/g, ""); //Removes all white space from string
      if (name.search(/[.]/) > 0) {
        var parts = name.split('.');
        parts[0] = parts[0].replace(/^0+/, "");
        parts[1] = parts[1].replace(/^0+/, "");
        name = parts[0] + '.' + parts[1];
      } else {
        name = name.replace(/^0+/, "");
      }

      return name;
    } else {
      return undefined;
    }
  }

  return comic;
};