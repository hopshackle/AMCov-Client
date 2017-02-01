
'use strict';
angular.module('amClientApp')
    .service('util', util);

function util() {
    return {
        convertToArray: function (items, separator) {
            console.log(items);
            if (items) return items.split(separator);
            return items;
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
        createSeasonRecord(seasonData) {
            return {
                description: seasonData.description,
                isService: seasonData.isService,
                serviceForMagus: seasonData.serviceForMagus,
                objId: seasonData._id,
                prettyText: function () {
                    if (this.isService) {
                        return this.description + "<br/>[Covenant Service]";
                    }
                    return this.description;
                }
            };
        }
    }
}

