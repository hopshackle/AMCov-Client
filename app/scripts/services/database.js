'use strict';
angular.module('amClientApp')
    .service('db', ['util', '$resource', db]);

function db(util, $resource) {

    var baseURL = "http://localhost\:3000/api";
    var cov_db = $resource(baseURL + "/:covenant", null, {
        'update': { method: 'PUT' }
    });
    var season_db = $resource(baseURL + "/:covenant/:magus/:objId", null, {
        'update': { method: 'PUT' }
    });

    return {
        writeRecord: function (covenant, magus, year, season, data, callback) {
            data.magus = magus;
            data.year = year;
            data.season = util.seasonToNumber(season);
            data.itemsUsed = data.itemsUsed.join("|");
            if (data.objId) {
                season_db.update({ covenant: covenant, magus: magus, objId: data.objId }, JSON.stringify(data), callback);
            } else {
                season_db.save({ covenant: covenant}, JSON.stringify(data), callback);
            }
        },
        getCovenantDetails: function (c) {
            var covenantDetails = {};
            cov_db.get({ covenant: c }, function (covRecord) {
                covenantDetails.covenantName = covRecord.name;
                covenantDetails.description = covRecord.description;
                covenantDetails.allMagi = covRecord.members;
            });
            return covenantDetails;
        },
        getSeasonData: function (cov) {
            for (var i in cov.covenant.allMagi) {
                var m = cov.covenant.allMagi[i];
                if (cov.selected[i]) {
                    var apiParams = { covenant: cov.covenant.covenantName, magus: m };
                    season_db.query(apiParams, function (seasonData) {
                        for (var j = 0; j < seasonData.length; j++) {
                            var key = seasonData[j].year + "-" + seasonData[j].season;
                            if (seasonData[j].year <= cov.endYear && seasonData[j].year >= cov.startYear) {
                                var seasonRecord = cov.seasonMap.get(key);
                                seasonRecord[seasonData[j].magus] = util.createSeasonRecord(seasonData[j]);
                                cov.seasonMap.set(key, seasonRecord);
                            }
                        }
                    });
                }
            }
            cov.seasons = [];
            for (var k of cov.seasonKeys) {
                cov.seasons.push(cov.seasonMap.get(k));
            }
        }
    }
}