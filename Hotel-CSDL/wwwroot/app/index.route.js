(function () {
    'use strict';

    angular
        .module('app')
        .config(route);

    route.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$urlMatcherFactoryProvider', '$compileProvider'];

    /** @ngInject */
    function route($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, $compileProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: true
        });

        $urlMatcherFactoryProvider.strictMode(false);
        $compileProvider.debugInfoEnabled(true);

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */

        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies) {
                $cookies = _$cookies;
            }
        ]);

        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('home', {
                url: '/',
                title: 'Phần mềm quản lý khách sạn',
                templateUrl: './views/home/index.html',
                controller: 'HomeController'
            })
            .state('login', {
                url: '/dang-nhap',
                title: 'Đăng nhập hệ thống',
                templateUrl: './views/login/index.html',
                controller: 'LoginController as vm'
            })
            //.state('help', {
            //    url: '/ho-tro',
            //    title: 'Hỗ trợ',
            //    templateUrl: './views/help/index.html',
            //    controller: 'HelpController as vm'
            //})
            //.state('docs', {
            //    url: '/huong-dan-su-dung',
            //    title: 'Hướng dẫn sử dụng',
            //    templateUrl: './views/docs/index.html',
            //    controller: 'DocsController as vm'
            //})
            ;

        $urlRouterProvider.otherwise('/');
    }

})();