'use strict';
angular.module('amClientApp')
    .service('db', ['util', '$resource', '$q', 'hdr', db]);

function db(util, $resource, $q, hdr) {

    var baseURL = hdr.url + ':' + hdr.port + '/api';
    console.log("Using " + baseURL);

    //   var baseURL = "http://localhost\:5000/api";
    var covList_db = $resource(baseURL, null, {});
    var cov_db = $resource(baseURL + "/:covenant", null, {
        'update': { method: 'PUT' }
    });
    var season_db = $resource(baseURL + "/:covenant/:magus/:objId", null, {
        'update': { method: 'PUT' }
    });

    var onError = function (res) {
        hdr.message = "Database Access Error: " + res.status + " " + res.statusText;
        if (res.status == 401) {
            hdr.message = hdr.message + "\nYou are not authorised to update data for this covenant";
        }
    };

    return {
        writeRecord: function (covenant, magus, year, season, data, callback) {
            hdr.message = "";
            data.magus = magus;
            data.year = year;
            data.season = util.seasonToNumber(season);
            data.itemsUsed = data.itemsUsed.join("|");
            if (data.objId) {
                season_db.update({ covenant: covenant, magus: magus, objId: data.objId }, JSON.stringify(data), callback, onError);
            } else {
                season_db.save({ covenant: covenant }, JSON.stringify(data), callback, onError);
            }
        },
        getCovenantList: function (callback) {
            covList_db.query({}, function (covList) {
                callback(covList);
            });
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
            hdr.message = "";
            var thing = util.emptySeasonMap(covenant, startYear, endYear);
            var seasonKeys = thing.keysInOrder;
            var seasonMap = thing.seasonMap;
            var seasons = [];
            var promises = [];
            var db = this;
            angular.forEach(covenant.allMagi, function (m) {
                var newPromise = $q.defer();
                promises.push(newPromise.promise);
                db.getMagusData(covenant.covenantName, m, function (seasonData) {
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
            });

            $q.all(promises).then(function () {
                for (var k of seasonKeys) {
                    seasons.push(seasonMap.get(k));
                }
                if (callback) { callback(seasons); }
            });
            return seasons;
        }
    };
}