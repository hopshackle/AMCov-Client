'use strict';

/**
 * @ngdoc function
 * @name amClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the amClientApp
 */
angular.module('amClientApp')
  .controller('MainCtrl', function () {
    var main = this;
  })
  .controller('HeaderCtrl', ['hdr', 'authService', function(hdr, authService) {
    var header = this;
    header.hdr = hdr;
    header.login = authService.login;
  }])
  .service('hdr', function() {
    // put this as a service, so that all pages can easily update where the user
    // has navigated to
    var hdr = this;
    hdr.covenantSelected = false;
    hdr.covenant = "";
    hdr.page = "index";
    hdr.setCovenant = function (covenant) {
      hdr.covenantSelected = true;
      hdr.covenant = covenant;
    }
  });
