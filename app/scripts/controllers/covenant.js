'use strict';

angular.module('amClientApp')
    .controller('CovCntrl', ['$routeParams', '$uibModal', 'util', 'db', 'uiGridConstants',
        function ($routeParams, $uibModal, util, db, uiGridConstants) {
            var cov = this;

            cov.apiRegister = function (gridApi) {
                cov.gridApi = gridApi;
            };

            cov.refreshColumns = function () {
                cov.columnDefs = [
                    { field: "year", width: 60, allowCellFocus: false },
                    { field: "season", width: 80, allowCellFocus: false }
                ];
                for (var i in cov.covenant.allMagi) {
                    if (cov.selected[i]) {
                        var m = cov.covenant.allMagi[i];
                        cov.columnDefs.push({
                            allowCellFocus: true,
                            displayName: m, field: m + ".prettyText()", width: "*",
                            cellTemplate: 'templates/seasonCellTemplate.html',
                            cellClass: function (grid, row, col, ri, rc) {
                                if (row.entity[col.displayName].isService) {
                                    return 'covService';
                                }
                            }
                        });
                    }
                }

                cov.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            };

            cov.startYear = 1220;
            cov.endYear = 1235;
            cov.selected = {};

            cov.refreshGrid = function () {
                cov.seasons = db.getSeasonData(cov.covenant, cov.startYear, cov.endYear, function (data) {
                    cov.refreshColumns();
                });
            };

            cov.covenant = db.getCovenantDetails($routeParams.covenant, function (covenant) {
                for (var i in cov.covenant.allMagi) {
                    cov.selected[i] = true;
                }
                cov.refreshColumns();
                cov.seasons = db.getSeasonData(covenant, cov.startYear, cov.endYear);
            });

            cov.selectAll = function (allOn) {
                for (var i in cov.covenant.allMagi) {
                    cov.selected[i] = allOn;
                }
            };

            cov.editCell = function (grid, row, col) {
                var year = row.entity.year;
                var season = row.entity.season;
                var seasonAsInt = util.seasonToNumber(season);
                $uibModal.open({
                    templateUrl: 'templates/edit-modal.html',
                    controller: 'SeasonEditController',
                    controllerAs: 'vm',
                    resolve: {
                        year: function () { return row.entity.year; },
                        season: function () { return row.entity.season; },
                        magus: function () { return col.displayName; },
                        data: function () { return row.entity[col.displayName]; },
                        onSave: function () { return cov.refreshGrid; },
                        covenant: function () { return cov.covenant; }
                    }
                });
            }
        }]);