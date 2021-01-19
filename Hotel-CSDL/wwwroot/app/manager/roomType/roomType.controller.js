(function () {
    'use strict';

    
    angular.module('app.manager').controller('RoomTypeController', roomType);

    roomType.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function roomType($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.roomType = {
            Id: 0,
            Name: '',
            Code: 0,
            Price: 0,
            Description: ''
        };
        
        vm.roomTypes = [];
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
            $service.Post('', 'loai-phong', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.roomTypes = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.roomType = {
                Id: 0,
                Name: '',
                Code: 0,
                Price: 0,
                Description: ''
            };
        }
        vm.submit = function (formRoomType) {
            if (formRoomType.$invalid) {
                angular.forEach(formRoomType.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.roomType.Id,
                Name: vm.roomType.Name,
                Price: vm.roomType.Price,
                Description: vm.roomType.Description
            };
            $service.Post('', 'loai-phong', 'save', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
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
            debugger;
            $service.Post('', 'loai-phong', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.roomType = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa loại phòng",
                text: "Bạn đồng ý xóa loại phòng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'loai-phong', 'deleted', Id, function (response) {
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


