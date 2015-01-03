var app = angular.module("mgaServer", [
'ngRoute',
'ngAnimate',
'ngAria',
'ngMaterial',
'basicListController'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/basic_list.html',
    controller: 'SeriesCtrl'
  }).otherwise({redirectTo:'/'});

}]);
app.config(['$mdThemingProvider', function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryColor('pink')
  .accentColor('orange');
}]);
