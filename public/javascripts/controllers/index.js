var app = angular.module("mgaServer", []);

app.controller("SeriesCtrl", function($scope, $http) {
  data = [
{title: "Placeholder",
status: "derping"}
  ];
 $scope.seriesList = data;

 $http.get("/api/search/series").success(function(data) {
   $scope.seriesList = data;
   console.log(data);
 });
});
