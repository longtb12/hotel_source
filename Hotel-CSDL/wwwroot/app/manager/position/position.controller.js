(function () {
    'use strict';

    //app.manager
    //    .controller('PositionController', position);
    angular.module('app.manager').controller('PositionController', position);

    position.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function position($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.position = {
            Id: 0,
            Name: '',
            Status: 0,
            Description: ''
        };
        //
        vm.positions = [];
        vm.total_page = 0;
        vm.request = {
            page_index: 1,
            page_size: 10
        }

        vm.init = function () {
            var requests = {
                pageIndex: vm.request.page_index,
                pageSize: vm.request.page_size,
                textSearch: ''
            };
            debugger;
            $service.Post('', 'chuc-danh', 'get-pading-position', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.positions = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.position = {
                Id: 0,
                Name: '',
                Status: 0,
                Description: ''
            };
        }
        vm.submit = function (formPosition) {
            if (formPosition.$invalid) {
                angular.forEach(formPosition.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.position.Id,
                Name: vm.position.Name,
                Description: vm.position.Description,
                Status: vm.position.Status
            };
            $service.Post('', 'chuc-danh', 'save-position', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.message);
                    return;
                }
                toastr.success('Lưu thành công !');
                vm.create();
                vm.init();
            });
        };
        vm.getdata = function GetById(Id) {
            var request = {
                Id: Id
            };
            //debugger;
            $service.Post('', 'chuc-danh', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.message);
                    return;
                }
                debugger;
                vm.position = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {
            
            swal({
                title: "Xóa chức danh",
                text: "Bạn đồng ý xóa chức danh này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'chuc-danh', 'deleted', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {

                            toastr.error($response.Message);
                            return;
                        }
                        toastr.success('Đã Xóa Thành Công.');
                        vm.create;
                        vm.init();
                    });
                }
            });

        };
        vm.init();
    }

})();