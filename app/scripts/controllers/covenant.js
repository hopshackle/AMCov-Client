'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', 'util', 'db', 'uiGridConstants',
        function ($routeParams, util, db, uiGridConstants) {
            var cov = this;

            cov.apiRegister = function (gridApi) {
                cov.gridApi = gridApi;
           //     gridApi.cellNav.on.navigate(scope, openEditModal);
            }

            cov.refreshGrid = function () {
                cov.columnDefs = [
                    { field: "year", width: 60 },
                    { field: "season", width: 80 }
                ]
                for (var i in cov.covenant.allMagi) {
                    if (cov.selected[i]) {
                        var m = cov.covenant.allMagi[i];
                        cov.columnDefs.push({
                            displayName: m, field: m + ".prettyText()", width: "*",
                            cellTemplate: '<div ng-bind-html="COL_FIELD" title="{{COL_FIELD}}"></div>' +
                                    '<button ng-show="grid.appScope.cov.allowEdit" data-toggle="modal" data-target="#modal" class="btn btn-block btn-default btn-xs">Edit</button>',
                            cellClass: function (grid, row, col, ri, rc) {
                                var cellContents = grid.getCellValue(row, col);
                                if (cellContents && cellContents.includes("[Covenant Service]"))
                                    return 'covService';
                            }
                        });
                    }
                }
                cov.updateSeasonKeys(); // synch
                cov.enrichWithSeasonData();   // asynch

                cov.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            };

            cov.startYear = 1220;
            cov.endYear = 1235;
            cov.selected = {};
            cov.allowEdit = true;

            cov.selectAll = function (allOn) {
                for (var i in cov.covenant.allMagi) {
                    cov.selected[i] = allOn;
                }
            }

            cov.updateSeasonKeys = function () {
                cov.seasonMap = new Map();
                cov.seasonKeys = [];
                for (var y = cov.startYear; y <= cov.endYear; y++) {
                    for (var s = 1; s <= 4; s++) {
                        var key = y + "-" + s;
                        cov.seasonKeys.push(key);
                        var seasonRecord = { year: y, season: util.seasonToString(s) }
                        for (var magusName of cov.covenant.allMagi) {
                            seasonRecord[magusName] = "";
                        }
                        cov.seasonMap.set(key, seasonRecord);
                    }
                }
            }

            cov.enrichWithSeasonData = function () {
                var seasonData = db.getSeasonData(cov);
            }

            cov.covenant = db.getCovenantDetails($routeParams.covenant);
        }]);