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
            cov.seasonMap = new Map();

            for (var i in cov.allMagi) {
                // get season data
                /* However I need to have the magus, year and seasons as the types
                */
                var m = cov.allMagi[i];
                season_db.query({ covenant: cov.covenantName, magus: m }, function (seasonData) {
                    for (var j = 0; j < seasonData.length; j++) {
                        var key = seasonData[j].year + "-" + seasonData[j].season;
                        var seasonRecord = cov.seasonMap.get(key);
                        if (!seasonRecord) {
                            seasonRecord = {
                                year: seasonData[j].year,
                                season: seasonData[j].season
                            };
                            for (var magusName of cov.allMagi) {
                                seasonRecord[magusName] = "";
                            }
                            cov.seasonMap.set(key, seasonRecord);
                        }
                        seasonRecord[seasonData[j].magus] = seasonData[j].description;
       //                 seasonRecord.isService = seasonData[j].isService;
        //                seasonRecord.serviceForMagus = seasonData[j].serviceForMagus
                        cov.seasonMap.set(key, seasonRecord);
                    }
                    cov.seasons = [];
                    console.log(cov.seasonMap);
                    for (var k of cov.seasonMap.keys()) {
                        cov.seasons.push(cov.seasonMap.get(k));
                    }
                    console.log(cov.seasons);
                });
            }

        });
    }]);