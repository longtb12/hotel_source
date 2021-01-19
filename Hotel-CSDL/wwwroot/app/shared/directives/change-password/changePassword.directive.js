(function () {
    'use strict';

    angular
        .module('app')
        .directive('changePassword', changePassword);

    changePassword.$inject = ['$window'];

    function changePassword($window) {
        // Usage:
        //     <changePassword></changePassword>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: './views/shared/directives/change-password/index.html',
            controller: ['$scope', '$service', 'toastr', '$rootScope', function ($scope, $service, toastr, $rootScope) {
                var vm = $scope;
                vm.request = {
                    new_password: null,
                    confirm_new_password: null,
                    created_user_name: $rootScope.globals.user_name
                };
                vm.submitChangePassword = function (form) {
                    if (form.$invalid) {
                        angular.forEach(form.$error.required, function (item) {
                            item.$pristine = false;
                        });
                        return;
                    }
                    $service.Post('he-thong', 'nguoi-dung', 'doi-mat-khau', vm.request, function (response) {
                        var $response = response.data;
                        if (!$response.success) {
                            toastr.error($response.message);
                            return;
                        }
                        toastr.success('Đổi mật khẩu thành công.', '');
                    });
                };
            }]
        };
        return directive;

        function link(scope, element, attrs) {
            //element.bind('click', function (e) {
            //    scope.$apply(function() { ;
            //        $("#change-password").modal("show");
            //    });
            //});
        }
    }

})();