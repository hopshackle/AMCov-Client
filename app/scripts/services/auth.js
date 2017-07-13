(function () {

  'use strict';

  angular
    .module('amClientApp')
    .service('authService', authService);

  authService.$inject = ['angularAuth0', '$timeout'];

  function authService(angularAuth0, $timeout) {

    function login() {
      angularAuth0.authorize();
    }

    return {
      login: login
    }
  }
})();