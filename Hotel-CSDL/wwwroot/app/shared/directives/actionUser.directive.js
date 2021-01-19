(function () {
    'use strict';

    angular
        .module('app')
        .directive('actionUser', actionUser);

    actionUser.$inject = ['$window'];

    function actionUser($window) {
        // Usage:
        //     <action></action>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var actions = sessionStorage.getItem("right");
            if (!actions.includes(attrs.actionUser)) {
                element.remove();
            }
            
        }
    }

})();