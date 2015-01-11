var app = angular.module("mgaServer", [
  'ngRoute',
  'basicListController'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/basic_list.html',
    controller: 'SeriesCtrl'
  }).otherwise({
    redirectTo: '/'
  });

}]);