'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', '$resource', 'util', 'uiGridConstants',
        function ($routeParams, $resource, util, uiGridConstants) {
            var cov = this;

            cov.refreshGrid = function () {
                console.log("Refreshing Grid");
                for (var i = 2; i < cov.columnDefs.length; i++) {
                    // we skip the first two columns, which are year and season
                    cov.columnDefs[i].visible = cov.selected[cov.columnDefs[i].field];
                }
                cov.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            };
            cov.apiRegister = function (gridApi) {
                console.log("Registering API");
                cov.gridApi = gridApi;
            }

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
                cov.columnDefs = [
                    { field: "year", width: 60 },
                    { field: "season", width: 80 }
                ]
                for (var m of cov.allMagi) {
                    cov.columnDefs.push({
                        displayName: m, field: m + ".prettyText()", width: "*",
                        cellTemplate: '<div ng-bind-html="COL_FIELD" title="{{COL_FIELD}}"></div>',
                        cellClass: function (grid, row, col, ri, rc) {
                            var cellContents = grid.getCellValue(row, col);
                            if (cellContents && cellContents.includes("[Covenant Service]"))
                                return 'covService';
                        }
                    });
                }
                for (var i in cov.allMagi) {
                    // get season data
                    /* However I need to have the magus, year and seasons as the types
                       so each time we encounter a new year/season, we create a record for it
                       and add in columns for all magi in the covenant.
                    */
                    var m = cov.allMagi[i];
                    season_db.query({ covenant: cov.covenantName, magus: m }, function (seasonData) {
                        for (var j = 0; j < seasonData.length; j++) {
                            var key = seasonData[j].year + "-" + seasonData[j].season;
                            var seasonRecord = cov.seasonMap.get(key);
                            if (!seasonRecord) {
                                seasonRecord = {
                                    year: seasonData[j].year,
                                    season: util.seasonToString(seasonData[j].season)
                                };
                                for (var magusName of cov.allMagi) {
                                    seasonRecord[magusName] = "";
                                }
                                cov.seasonMap.set(key, seasonRecord);
                            }
                            seasonRecord[seasonData[j].magus] = util.createSeasonRecord(seasonData[j]);
                            cov.seasonMap.set(key, seasonRecord);
                        }
                        cov.seasons = [];
                        var sortedKeys = [];
                        for (var k of cov.seasonMap.keys()) {
                            sortedKeys.push(k);
                        }
                        sortedKeys.sort();
                        for (var k of sortedKeys) {
                            cov.seasons.push(cov.seasonMap.get(k));
                        }
                    });
                }

            });
        }]);