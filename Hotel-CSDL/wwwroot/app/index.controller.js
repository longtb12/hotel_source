(function () {
    'use strict';

    angular
        .module('app')
        .controller('IndexController', index);

    index.$inject = ['$scope', '$state', '$http', '$rootScope', 'appConfig', '$service', 'toastr'];

    /** @ngInject */
    function index($scope, $state, $http, $rootScope, appConfig, $service, toastr) {
        /* jshint validthis:true */
        var vm = $scope;
        vm.$state = $state;
        /* */
        (function activate() {
            if (sessionStorage.getItem('access-token')) {
                $http.defaults.headers.common['AccessToken'] = CryptoJS.AES.decrypt(sessionStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
            }
        })();
        vm.changePassword = function () {
            $("#change-password").modal("show");
        };
        vm.logOut = function () {
            $service.Post('', 'xac-thuc', 'dang-xuat', {}, function (response) {
                var $response = response.data;
                if (!$response.success) {
                    toastr.error($response.message);
                    return;
                }
                //
                sessionStorage.setItem("right", "");
                $rootScope.globals = {};
                //$rootScope.auth_access = null;        
                sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));   
                sessionStorage.setItem("Auth-Access", "");
                toastr.success('Đăng xuất thành công');
                $state.go('login');
            });
            
        }
    }

})();
