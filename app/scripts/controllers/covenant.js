'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', function($routeParams) {
        var cov = this;
        cov.covenantName = $routeParams.covenant.slice(0, 1).toUpperCase() + $routeParams.covenant.slice(1);
        cov.allMagi = ['Martin', 'Valery', 'Gunter', 'Orlaith', 'Pumilius'];
    }]);