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
    main.fghfh = '';
  })
  .controller('HeaderCtrl', ['hdr', 'authService', function (hdr, authService) {
    var header = this;
    header.hdr = hdr;
    header.auth = authService;
  }])
  .service('hdr', ['$location', function ($location) {
    // put this as a service, so that all pages can easily update where the user
    // has navigated to
    var hdr = this;
    hdr.port = $location.port();
    var numberOfColons = $location.absUrl().split(':').length;
    if (numberOfColons == 1) {
      hdr.url = $location.absUrl().split(':')[0].split('#')[0];
    } else {
      hdr.url = $location.absUrl().split(':')[1].split('#')[0];
    }

    if (hdr.url == 'http') {
      hdr.url = 'http://localhost';
    }
    console.log("Port in use is " + hdr.port);
    console.log("URL is " + hdr.url);
    hdr.covenantSelected = false;
    hdr.covenant = "";
    hdr.message = "";
    hdr.page = "index";
    hdr.setCovenant = function (covenant) {
      hdr.covenantSelected = true;
      hdr.covenant = covenant;
    };
  }]);
