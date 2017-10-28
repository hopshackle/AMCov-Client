'use strict';

angular.module('amClientApp')
    .controller('ServiceCtrl', ['$routeParams', '$q', 'util', 'db', 'uiGridConstants', 'hdr',
        function ($routeParams, $q, util, db, uiGridConstants, hdr) {
            var service = this;

            hdr.page = 'service';
            hdr.setCovenant($routeParams.covenant);

            service.apiRegister = function (gridApi) {
                service.gridApi = gridApi;
            };

            db.getCovenantDetails($routeParams.covenant, function (covenant) {
                service.covenant = covenant;
                var allData = [];
                var promises = [];

                angular.forEach(covenant.members, function (magus) {
                    // we need to do this inside a function, as JS does not have block-level scopes
                    // and we need to distinguish each promise from the next
                    var promise = $q.defer();
                    promises.push(promise.promise);

                    db.getMagusData(covenant.name, magus, function (magusData) {
                        var data = {};
                        data.Magus = magus;
                        data.Service = 0;
                        // set zeros for service done for sodales
                        for (var j in covenant.members) {
                            data[covenant.members[j]] = 0;
                            data[covenant.members[j] + "_S"] = 0;
                        }
                        if (magusData.length > 0) {
                            data.Seasons = magusData.length;
                            for (var record of magusData) {
                                if (record.serviceForMagus && record.serviceForMagus != "") {
                                    data[record.serviceForMagus] += 1;
                                    if (record.isService) {
                                        data[record.serviceForMagus + "_S"] += 1;
                                    }
                                    // the _S keeps track of seasons service done for other magi
                                } else {
                                    if (record.isService) {
                                        data.Service += 1;
                                    }
                                }
                            }
                        } else {
                            // no data for this magus
                            data.Seasons = 0;
                        }
                        allData.push(data);
                        promise.resolve();
                    });
                });

                service.columnDefs = [
                    // magus in rows, residence, service, owed then all magi in columns
                    { field: "Magus", width: "*" },
                    { field: "Seasons", width: "*" },
                    { field: "Service", width: "*" }
                ];

                for (var i in service.covenant.members) {
                    var m = service.covenant.members[i];
                    service.columnDefs.push({
                        displayName: m, field: m, width: "*"
                    });
                }
                service.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);

                // Now wait for all the db queries on individual magi to return
                $q.all(promises).then(function () {
                    // Now we can take account of seasons owed
                    for (var i in service.covenant.members) {
                        var magus1 = service.covenant.members[i];
                        for (var j in service.covenant.members) {
                            if (j <= i) {
                                continue;
                            }
                            var magus2 = service.covenant.members[j];
                            var oneForTwo = allData[i][magus2];
                            allData[i][magus2] -= allData[j][magus1];
                            // subtract the seasons worked by magus2 for magus 1
                            // from the seasons worked by magus1 for magus2
                            allData[j][magus1] -= oneForTwo;
                            // and vice versa
                            allData[i].Service += allData[j][magus1 + "_S"];
                            allData[j].Service += allData[i][magus2 + "_S"];
                            // and then take account of seasons of service undertaken by the other
                        }
                        allData[i][magus1] = ""; // cannot owe oneself
                    }
                    service.displayData = allData;
                });
            });
        }]);