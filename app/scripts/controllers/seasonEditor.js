'use strict';

angular.module('amClientApp')
    .controller('SeasonEditController', ['$uibModalInstance', 'year', 'season', 'magus', function($uibModalInstance, year, season, magus) {
        var scope = this;
        scope.year = year;
        scope.season = season;
        scope.magus = magus;

        scope.close = function() {
            $uibModalInstance.close();
        }
        scope.save = function() {
            $uibModalInstance.close();
        }
    }]);