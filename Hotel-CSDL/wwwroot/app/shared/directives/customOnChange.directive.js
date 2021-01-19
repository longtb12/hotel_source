(function () {
    'use strict';

    angular
        .module('app')
        .directive('customOnChange', customOnChange);

    customOnChange.$inject = [];

    function customOnChange() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    }

})();