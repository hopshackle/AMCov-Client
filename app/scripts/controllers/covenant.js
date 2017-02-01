'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', '$resource', function ($routeParams, $resource) {
        var cov = this;
        var baseURL = "http://localhost\:3000/api";
        var cov_db = $resource(baseURL + "/:covenant", null, {
            'update': { method: 'PUT' }
        });
        var season_db = $resource(baseURL + "/:covenant/:magus", null, {
            'update': { method: 'PUT' }
        });
        cov_db.get({ covenant: $routeParams.covenant }, function (covRecord) {
            cov.covenantName = covRecord.name;
            cov.description = covRecord.description;
            cov.allMagi = covRecord.members;

            for (var i in cov.allMagi) {
                // get season data
                var m = cov.allMagi[i];
                season_db.query({ covenant: cov.covenantName, magus: m }, function (seasonData) {
                    if (seasonData.length > 0) {
                        var magus = seasonData[0].magus;
                        cov[magus] = seasonData;
                    }
                });
            }
        });
    }]);