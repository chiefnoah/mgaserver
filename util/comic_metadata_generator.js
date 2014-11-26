module.exports = function(path) {
  var comic = require('./comic_metadata');
  comic.relative_path = path.replace(/^.\/Comics/, "");
  var info = [];
  info = path.split('/');

  comic.series_title = info[info.length - 2];

  comic.chapter = findChapter(info[info.length - 1]);
  //console.log(findChapter(info[info.length - 1]));

  //comic._id = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }

  function findChapter(fileName) {
    //console.log(fileName);
    var name = fileName;
    name = name.substring(0, fileName.lastIndexOf('.'));
    //console.log(name);
    re = /[0-9]+/;
    if (re.test(name)) {
      name = name.replace(/[a-zA-Z]+/g, ""); //Removes all letters from string
      name = name.replace(/\s/g, ""); //Removes all white space from string
      if (name.search(/[.]/) > 0) {
        var parts = name.split('.');
        //console.log(parts);
        parts[0] = parts[0].replace(/^0+/, "");
        parts[1] = parts[1].replace(/^0+/, "");
        name = parts[0] + '.' + parts[1];
      } else {
        name = name.replace(/^0+/, "");
      }
      //console.log(name);
      return +name;
    } else {
      return undefined;
    }
  }

  return comic;
};