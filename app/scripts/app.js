'use strict';

/**
 * @ngdoc overview
 * @name amClientApp
 * @description
 * # amClientApp
 *
 * Main module of the application.
 */
angular
  .module('amClientApp', [
    //   'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.cellNav',
    'ui.bootstrap',
    'auth0.auth0',
    'angular-jwt'
  ])
  .config(config)
  .run(run);

run.$inject = ['authService'];

function run(authService) {
  // Handle the authentication result in the hash
  authService.handleAuthentication();
}

config.$inject = ['angularAuth0Provider',
  '$locationProvider',
  '$httpProvider',
  'jwtOptionsProvider', 'callbackURI'];


function config(angularAuth0Provider, $locationProvider, $httpProvider, jwtOptionsProvider, callbackURI) {
  // Initialization for the angular-auth0 library

  console.log("Using " + callbackURI);

  angularAuth0Provider.init({
    clientID: 'yOWNc5CAVRvDHLeGVw8BHU13HQxQHM7r',
    domain: 'hopshackle.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'arsmagica.uk',
    //    redirectUri: 'http://localhost:5000/#!/callback',
    redirectUri: callbackURI,
    scope: 'openid'
  });


  //   $locationProvider.hashPrefix('');

  /// Comment out the line below to run the app
  // without HTML5 mode (will use hashes in routes)
  //$locationProvider.html5Mode({
  //  enabled: true
  //});

  jwtOptionsProvider.config({
    tokenGetter: function () {
      return localStorage.getItem('access_token');
    },
    whiteListedDomains: ['localhost']
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}


