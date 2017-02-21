'use strict';

angular.module('amClientApp')
    .controller('ServiceCntrl', ['$routeParams', 'util', 'db', 'uiGridConstants',
        function ($routeParams, util, db, uiGridConstants) {
            var service = this;

            service.apiRegister = function (gridApi) {
                service.gridApi = gridApi;
            }

            service.covenant = db.getCovenantDetails($routeParams.covenant, function (covenant) {
                var allData = {};
                for (var i in covenant.allMagi) {
                    db.getMagusData(covenant.covenantName, covenant.allMagi[i], function (magusData) {
                        var data = {};
                        var magus = magusData[0].magus;
                        data[magus].seasons = magusData.length;
                        data[magus].service = 0;
                        // set zeros for service done for sodales
                        for (var j in covenant.allMagi) {
                            data[magus][covenant.allMagi[j]] = 0;
                        }
                        for (var record of magusData) {
                            if (record.isService) data[magus] += 1;
                            if (record.serviceForMagus != "") {
                                data[magus][record.serviceForMagus] += 1;
                            }
                        }
                        allData[magus] = data;
                    });
                }

                service.columnDefs = [
                    // magus in rows, residence, service, owed then all magi in columns
                    { field: "All Seasons", width: 80 },
                    { field: "Service", width: 80 },
                    { field: "Owed", width: 80 }
                ]
                for (var i in service.covenant.allMagi) {
                    var m = service.covenant.allMagi[i];
                    service.columnDefs.push({
                        displayName: m, field: m, width: "*"
                    });
                }
                service.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            });
        }]);