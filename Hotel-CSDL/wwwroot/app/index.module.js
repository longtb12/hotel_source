(function () {
    'use strict';

    /**
     * Main module of the Gov.Lis.WebApp
     */
    angular.module('app', [
        // Angular modules 
        'ui.router',
        'ngAnimate',
        'ngCookies',
        'toastr',
        'blockUI',
        'chart.js',
        'angularjs-dropdown-multiselect',
        'ng.deviceDetector',
        // Custom modules
        'app.manager',
        //'app.project',
        //'app.tracking',
        //'app.report'
        // 3rd Party Modules

    ]);

})();