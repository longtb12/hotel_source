(function () {
    'use strict';

    angular
        .module('app.manager')
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

        var root_path = {
            prefix: "/he-thong"
        };

        // State definitions
        $stateProvider
            .state('department', {
                url: root_path.prefix + '/phong-ban',
                title: 'Quản lý hành chính',
                templateUrl: './views/manager/department/index.html',
                controller: 'DepartmentController'
            })
            .state('function', {
                url: root_path.prefix + '/chuc-nang',
                title: 'Quản lý chức năng',
                templateUrl: './views/manager/function/Index.html',
                controller: 'FunctionController'
            })
            .state('position', {
                url: root_path.prefix + '/chuc-danh',
                title: 'Quản lý chức danh',
                templateUrl: './views/manager/position/position.html',
                controller: 'PositionController'
            })
            .state('roomType', {
                url: root_path.prefix + '/loai-phong',
                title: 'Quản lý loại phòng',
                templateUrl: './views/manager/roomType/roomType.html',
                controller: 'RoomTypeController'
            })
            .state('room', {
                url: root_path.prefix + '/phong',
                title: 'Quản lý phòng',
                templateUrl: './views/manager/room/room.html',
                controller: 'RoomController'
            })
            .state('customer', {
                url: root_path.prefix + '/khach-hang',
                title: 'Quản lý khách hàng',
                templateUrl: './views/manager/customer/customer.html',
                controller: 'CustomerController'
            })
            .state('user', {
                url: root_path.prefix + '/nguoi-dung',
                title: 'Quản lý người dùng',
                templateUrl: './views/manager/user/user.html',
                controller: 'UserController'
            })
            .state('listusedgd', {
                url: root_path.prefix + '/danh-sach-kh-dang-su-dung',
                title: 'Danh sách khách hàng đang sử dụng',
                templateUrl: './views/manager/listUsedGD/index.html',
                controller: 'ListUserGDController'
            })
            .state('listacceptgd', {
                url: root_path.prefix + '/danh-sach-kh-da-thanh-toan',
                title: 'Danh sách khách hàng đã thanh toán',
                templateUrl: './views/manager/listAcceptGD/index.html',
                controller: 'ListAcceptGDController'
            });

        $urlRouterProvider.otherwise('/');
    }

})();