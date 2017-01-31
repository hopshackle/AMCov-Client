'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', '$resource', function ($routeParams, $resource) {
        var cov = this;
        var baseURL = "http://localhost\:3000/api";
        var db = $resource(baseURL + "/:covenant", null, {
            'update': { method: 'PUT' }
        });
        db.get({ covenant: $routeParams.covenant }, function (covRecord) {
            cov.covenantName = covRecord.name;
            cov.description = covRecord.description;
            cov.allMagi = covRecord.members;
        });
    }]);