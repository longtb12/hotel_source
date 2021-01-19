(function () {
    'use strict';


    angular.module('app.manager').controller('RoomController', room);

    room.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function room($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.room = {
            Id: 0,
            Name: '',
            RoomTypeId: 0,
            RoomTypeName: '',
            Code: 0,
            Description: ''
        };

        vm.rooms = [];
        vm.total_page = 0;
        vm.roomTypes = [];
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
            $service.Post('', 'room', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.rooms = $response.listdata.Data;
                vm.roomTypes = $response.roomTypes;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.room = {
                Id: 0,
                Name: '',
                RoomTypeId: 0,
                RoomTypeName: '',
                Code: 0,
                Description: ''
            };
        }
        vm.submit = function (formRoom) {
            if (formRoom.$invalid) {
                angular.forEach(formRoom.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.room.Id,
                Name: vm.room.Name,
                RoomTypeId: vm.room.RoomTypeId,
                Description: vm.room.Description
            };
            $service.Post('', 'room', 'save', requests, function (response) {
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
            $service.Post('', 'room', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.room = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa phòng",
                text: "Bạn đồng ý xóa phòng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'room', 'deleted', Id, function (response) {
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


