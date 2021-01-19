(function () {
    'use strict';


    angular.module('app.manager').controller('CustomerController', customer);

    customer.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function customer($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.customer = {
            Id: 0,
            Code: '',
            FirstName: '',
            LastName: '',
            IDCard: '',
            Email: '',
            PhoneNumber: '',
            Address: '',
            Gender: null,
            Description: ''
        };

        vm.customers = [];
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
            $service.Post('', 'customer', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.customers = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.customer = {
                Id: 0,
                Code: '',
                FirstName: '',
                LastName: '',
                IDCard: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                Gender: null,
                Description: ''
            };
        }
        vm.submit = function (formCustomer) {
            if (formCustomer.$invalid) {
                angular.forEach(formCustomer.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.customer.Id,
                Code: vm.customer.Code,
                FirstName: vm.customer.FirstName,
                LastName: vm.customer.LastName,
                IDCard: vm.customer.IDCard,
                Email: vm.customer.Email,
                PhoneNumber: vm.customer.PhoneNumber,
                Address: vm.customer.Address,
                Gender: vm.customer.Gender,
                Description: vm.customer.Description
            };
            $service.Post('', 'customer', 'save', requests, function (response) {
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
            $service.Post('', 'customer', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.customer = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa khách hàng",
                text: "Bạn đồng ý xóa khách hàng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'customer', 'deleted', Id, function (response) {
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


