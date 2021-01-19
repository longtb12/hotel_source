(function () {
    'use strict';

    angular
        .module('app')
        .directive('navbar', navbar);

    navbar.$inject = ['$rootScope', '$state'];

    function navbar($rootScope, $state) {
        // Usage:
        //     <navbar></navbar>
        // Creates:
        // 
        var directive = {};

        directive.restrict = 'E';
        directive.templateUrl = 'views/shared/navbar/index.html';

        return directive;
    }

})();