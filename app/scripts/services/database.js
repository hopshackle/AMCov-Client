'use strict';
angular.module('amClientApp')
    .service('db', ['util', '$resource', '$q', db]);

function db(util, $resource, $q) {

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
                season_db.save({ covenant: covenant }, JSON.stringify(data), callback);
            }
        },
        getCovenantDetails: function (c, callback) {
            var covenantDetails = {};
            cov_db.get({ covenant: c }, function (covRecord) {
                covenantDetails.covenantName = covRecord.name;
                covenantDetails.description = covRecord.description;
                covenantDetails.allMagi = covRecord.members;
                callback(covenantDetails);
            });
            return covenantDetails;
        },
        getMagusData: function (covenant, magus, callback) {
            var apiParams = { covenant: covenant, magus: magus };
            season_db.query(apiParams, callback);
        },
        getSeasonData: function (covenant, startYear, endYear, callback) {
            var thing = util.emptySeasonMap(covenant, startYear, endYear);
            var seasonKeys = thing.keysInOrder;
            var seasonMap = thing.seasonMap;
            var seasons = [];
            for (var i in covenant.allMagi) {
                var m = covenant.allMagi[i];
                var promises = {};
                var newPromise = $q.defer();
                promises[m] = newPromise;
                this.getMagusData(covenant.covenantName, m, function (seasonData) {
                    for (var j = 0; j < seasonData.length; j++) {
                        var key = seasonData[j].year + "-" + seasonData[j].season;
                        if (seasonData[j].year <= endYear && seasonData[j].year >= startYear) {
                            var seasonRecord = seasonMap.get(key);
                            seasonRecord[seasonData[j].magus] = util.createSeasonRecord(seasonData[j]);
                            seasonMap.set(key, seasonRecord);
                        }
                    }
                    newPromise.resolve();
                });
            }
            var p = [];
            for (var m in promises) {
                p.push(promises[m]);
            }
            $q.all(promises).then(function () {
                for (var k of seasonKeys) {
                    seasons.push(seasonMap.get(k));
                }
                if (callback) callback(seasons);
            });
            return seasons;
        }
    }
}