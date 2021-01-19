(function () {
    'use strict';

    angular
        .module('app')
        .directive('compareTo', compare);

    function compare() {
        return {
            require: "ngModel",
            scope: {
                compareTolValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {                
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.compareTolValue;
                };

                scope.$watch("compareTolValue",
                    function () {                        
                        ngModel.$validate();
                    });
            }
        };
    }
})();
