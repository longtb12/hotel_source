(function () {
    'use strict';

    angular
        .module('app')
        .directive('footerView', footer);

    function footer() {
        // Usage:
        //     <footer-view></footer-view>
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            templateUrl: 'views/shared/footer/index.html'
        };
        return directive;
    }

})();