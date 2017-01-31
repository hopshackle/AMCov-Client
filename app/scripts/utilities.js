
'use strict';
angular.module('amClientApp')
    .service('util', util);

function util() {
    return {
        convertToArray: function (items, separator) {
            console.log(items);
            if (items) return items.split(separator);
            return items;
        }
    }
}

