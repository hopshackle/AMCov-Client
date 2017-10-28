
'use strict';
angular.module('amClientApp')
    .service('util', util);

function util() {

    return {

        save: function (key, value) {
            window.localStorage[key] = value;
        },
        load: function (key, defaultValue) {
            var retValue = window.localStorage[key];
            if (retValue) {
                return retValue;
            }
            return defaultValue;
        },
        convertToArray: function (items, separator) {
            if (items) {
                return items.split(separator);
            }
            return [];
        },
        arrayToString: function (items, separator) {
            if (items) {
                return items.join(separator);
            }
            return "";
        },
        seasonToNumber: function (seasonAsString) {
            switch (seasonAsString) {
                case 'Winter':
                    return 1;
                case 'Spring':
                    return 2;
                case 'Summer':
                    return 3;
                case 'Autumn':
                    return 4;
                default:
                    return 0;
            }
        },
        seasonToString: function (seasonAsNumber) {
            switch (seasonAsNumber) {
                case 1:
                    return 'Winter';
                case 2:
                    return 'Spring';
                case 3:
                    return 'Summer';
                case 4:
                    return 'Autumn';
                default:
                    return 'Unknown';
            }
        },
        createSeasonRecord: function (seasonData) {
            return {
                description: seasonData.description,
                isService: seasonData.isService,
                serviceForMagus: seasonData.serviceForMagus,
                objId: seasonData._id,
                prettyText: function () {
                    if (this.isService) {
                        return this.description; // + "<br/>[Covenant Service]";
                    }
                    return this.description;
                }
            };
        },
        emptySeasonMap: function (covenant, startYear, endYear) {
            var seasonMap = new Map();
            var seasonKeys = [];
            for (var y = startYear; y <= endYear; y++) {
                for (var s = 1; s <= 4; s++) {
                    var key = y + "-" + s;
                    seasonKeys.push(key);
                    var seasonRecord = { year: y, season: this.seasonToString(s) };
                    for (var magusName of covenant.members) {
                        seasonRecord[magusName] = {};
                        seasonRecord[magusName].prettyText = function () { return "---"; };
                    }
                    seasonMap.set(key, seasonRecord);
                }
            }
            var retValue = {};
            retValue.keysInOrder = seasonKeys;
            retValue.seasonMap = seasonMap;
            return retValue;
        }
    };
}

