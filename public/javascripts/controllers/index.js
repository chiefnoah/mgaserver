var app = angular.module("mgaServer", []);

app.controller("SeriesCtrl", function($scope) {
  data = [
{title: "Placeholder",
status: "derping"}
  ];
 $scope.seriesList = data;
  xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      data = xmlhttp.responseText;
      console.log(data);
    }
  };

  xmlhttp.open("GET", "/api/search/series", true);
  xmlhttp.send();
});
