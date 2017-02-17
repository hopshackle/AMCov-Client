'use strict';

angular.module('amClientApp')
    .controller('SeasonEditController', ['$uibModalInstance', 'db', 'data', 'covenant', 'year', 'season', 'magus',
        function ($uibModalInstance, db, data, covenant, year, season, magus) {

            var scope = this;
            scope.year = year;
            scope.season = season;
            scope.magus = magus;
            scope.covenant = covenant;

            scope.data = {};
            scope.data.objId = data.objId;
            scope.data.description = data.description;
            scope.data.isService = data.isService;
            scope.data.serviceForMagus = data.serviceForMagus;
            scope.data.itemsUsed = data.itemsUsed ? data.itemsUsed.slice() : [];

            console.log(data);
            console.log(covenant);

            scope.close = function () {
                $uibModalInstance.close();
            }
            scope.save = function () {
                db.writeRecord(covenant.covenantName, magus, year, season, scope.data);
                $uibModalInstance.close();
            }
        }]);