'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', '$uibModal', 'util', 'db', 'uiGridConstants',
        function ($routeParams, $uibModal, util, db, uiGridConstants) {
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
                            cellTemplate: 'views/cellTemplate.html',
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

            cov.covenant = db.getCovenantDetails($routeParams.covenant);

            cov.startYear = 1220;
            cov.endYear = 1235;
            cov.selected = {};
            cov.allowEdit = false;
            cov.editPrompt = "Edit Seasons"

            cov.selectAll = function (allOn) {
                for (var i in cov.covenant.allMagi) {
                    cov.selected[i] = allOn;
                }
            };

            cov.toggleTableEditable = function () {
                cov.allowEdit = !cov.allowEdit;
                if (cov.allowEdit) {
                    cov.editPrompt = "Turn off edit";
                } else {
                    cov.editPrompt = "Edit Seasons";
                }
            };

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
            };

            cov.enrichWithSeasonData = function () {
                var seasonData = db.getSeasonData(cov);
            };

            cov.editCell = function(grid, row, col) {
                var year = row.entity.year;
                var season = row.entity.season;
                var seasonAsInt = util.seasonToNumber(season);
                var key = year + "-" + seasonAsInt;
                $uibModal.open({
                    templateUrl: 'views/edit-modal.html',
                    controller: 'SeasonEditController',
                    controllerAs: 'vm',
                    resolve: {
                        year: function () { return row.entity.year; },
                        season: function () { return row.entity.season; },
                        magus: function() { return col.displayName;},
                        data: function() { return cov.seasonMap.get(key)[col.displayName]},
                        covenant: function() {return cov.covenant;}
                   }
                });
            }
        }]);