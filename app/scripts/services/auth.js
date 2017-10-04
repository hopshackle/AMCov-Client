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

    function handleAuthentication() {
      var mainHash = window.location.hash;
      var fudgedHash = '#/' + mainHash.slice(mainHash.indexOf('access_token'));
      angularAuth0.parseHash({ hash: fudgedHash }, function (err, authResult) {
        console.log(authResult);
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log(authResult);
          setSession(authResult);
        } else if (err) {
          $timeout(function () {
            // stuff
          });
          console.log(err);
        }
      });
    }

    function setSession(authResult) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
    }

    function logout() {
      // Remove tokens and expiry time from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
    }

    function isAuthenticated() {
      // Check whether the current time is past the access token's expiry time
      let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }

    return {
      login: login,
      handleAuthentication: handleAuthentication,
      setSession: setSession,
      logout: logout,
      isAuthenticated: isAuthenticated
    }
  }

})();