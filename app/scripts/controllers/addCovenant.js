'use strict';

angular.module('amClientApp')
    .controller('NewCovCtrl', ['$routeParams', 'util', 'db', 'hdr',
        function ($routeParams, util, db, hdr) {
            var vm = this;

            hdr.message = "";
            vm.insertMode = true;
            vm.itemList = "";
            vm.magiList = "";

            if ($routeParams.covenant && $routeParams.covenant != "") {
                hdr.setCovenant($routeParams.covenant);
                vm.insertMode = false;
                vm.name = $routeParams.covenant;
                db.getCovenantDetails(vm.name, function (data) {
                    vm.description = data.description;
                    vm.magiList = util.arrayToString(data.members, "\n");
                    vm.itemList = util.arrayToString(data.items, "\n");
                });
                hdr.page = 'amendCovenant';
            } else {
                vm.insertMode = true;
                hdr.page = 'addCovenant';
            }

            var insertCallback = function (res) {
                // res will be covenant object
                vm.clear();
                hdr.message = "Saved " + res.name + " to database successfully";
            };

            var insertOnError = function (res) {
                console.log(res);
                var message = res.data.message ? res.data.message : (res.statusText + " (" + res.status + ")");
                hdr.message = "Save to database failed: " + message;
            };

            vm.save = function () {
                var newCov = {};
                newCov.name = vm.name;
                newCov.description = vm.description;
                newCov.items = vm.itemList.replace(/\r\n/g, "\n").split("\n");
                newCov.members = vm.magiList.replace(/\r\n/g, "\n").split("\n");
                if (!vm.insertMode) {
                    db.amendCovenant(newCov, insertCallback, insertOnError);
                } else {
                    db.insertCovenant(newCov, insertCallback, insertOnError);
                }
            };

            vm.clear = function () {
                vm.name = "";
                vm.description = "";
                vm.magiList = "";
            };

            vm.delete = function() {
                db.deleteCovenant(vm.name, insertCallback, insertOnError);
            };
        }]);