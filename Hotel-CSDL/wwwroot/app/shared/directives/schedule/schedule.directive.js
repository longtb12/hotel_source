(function () {
    'use strict';

    angular
        .module('app')
        .directive('schedule', schedule);

    schedule.$inject = [];

    function schedule($window) {
        // Usage:
        //     <schedule></schedule>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: true,
            templateUrl: './views/shared/directives/schedule/schedule.html',
            transclude: true,
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();