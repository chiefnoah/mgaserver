var basicListController = angular.module('basicListController', []);

basicListController.controller("SeriesCtrl", function($scope, $http) {
  data = [{
    title: "Placeholder",
    status: "placeholding..."
  }];
  $scope.seriesList = data;

  $http.get("/api/search/series").success(function(data) {
    $scope.seriesList = data;
    console.log(data);
  });
});