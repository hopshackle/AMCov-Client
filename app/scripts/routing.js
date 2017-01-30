'use strict';

angular.module('amClientApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/:covenant', {
        templateUrl: 'views/covenant.html',
        controller: 'CovCntrl',
        controllerAs: 'cov'
      })
      .otherwise({
        redirectTo: '/'
      });
  });