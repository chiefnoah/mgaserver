var app = angular.module("mgaServer", []);

app.controller("SeriesCtrl", function() {
  controller = this;

  xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      controller.series = xmlhttp.responseText;
      console.log(controller.series);
    }
  };

  xmlhttp.open("GET", "/api/search/series", true);
  xmlhttp.send();


});
