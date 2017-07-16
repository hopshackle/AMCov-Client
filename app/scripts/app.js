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
    'auth0.auth0'
  ])
  .config(config)
  .run(run);

run.$inject = ['authService'];

function run(authService) {
  // Handle the authentication
  // result in the hash
  authService.handleAuthentication();
}

config.$inject = ['angularAuth0Provider', '$locationProvider'];

function config(angularAuth0Provider, $locationProvider) {
  // Initialization for the angular-auth0 library
  angularAuth0Provider.init({
    clientID: 'yOWNc5CAVRvDHLeGVw8BHU13HQxQHM7r',
    domain: 'hopshackle.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://hopshackle.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000/#!/callback',
    scope: 'openid'
  });

//   $locationProvider.hashPrefix('');

  /// Comment out the line below to run the app
  // without HTML5 mode (will use hashes in routes)
  //$locationProvider.html5Mode({
  //  enabled: true
  //});
}


