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
  .controller('HeaderCtrl', function() {
    var hdr = this;
    hdr.covenantSelected = false;
    hdr.covenant = "";
    hdr.setCovenant = function (covenant) {
      hdr.covenantSelected = true;
      hdr.covenant = covenant;
    }
  });
