'use strict';

angular.module('amClientApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/addCovenant', {
        templateUrl: 'views/addCovenant.html',
        controller: 'NewCovCtrl',
        controllerAs: 'vm'
      })
      .when('/:covenant/updateStatic', {
        templateUrl: 'views/addCovenant.html',
        controller: 'NewCovCtrl',
        controllerAs: 'vm'
      })
      .when('/callback', {
        templateUrl: 'views/callback.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/:covenant/service', {
        templateUrl: 'views/service.html',
        controller: 'ServiceCtrl',
        controllerAs: 'service'
      })
      .when('/:covenant', {
        templateUrl: 'views/covenant.html',
        controller: 'CovCtrl',
        controllerAs: 'cov'
      })
      .otherwise({
        redirectTo: '/'
      });
  });