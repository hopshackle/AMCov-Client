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
  .config(config);

  config.$inject = [
    'angularAuth0Provider'
  ];

  function config(
    angularAuth0Provider
  ) {

    // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: 'yOWNc5CAVRvDHLeGVw8BHU13HQxQHM7r',
      domain: 'hopshackle.eu.auth0.com',
      responseType: 'token id_token',
      audience: 'https://hopshackle.eu.auth0.com/userinfo',
      redirectUri: 'http://localhost:3000/#!/callback',
      scope: 'openid'
    });
  }


