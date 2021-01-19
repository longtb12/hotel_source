(function () {

    'use strict';
    angular.module('app.manager').controller('DepartmentController', index);

    index.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function index($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
        var vm = $scope;
        vm.dropDownlists = [];
        vm.Department = {
            Id : 0,
            ParentId : 0,
            IsUnit: false,
            Acronym: '',
            ShortName: '',
            FullName: '',
            PhoneNumber: '',
            Email: '',
            Address: '',
            Description: '',
            ActUserId: $rootScope.globals.user_id
        };

        vm.create = function () {
            vm.Department = {
                Id: 0,
                ParentId: 0,
                IsUnit: false,
                Acronym: '',
                ShortName: '',
                FullName: '',
                PhoneNumber: '',
                Email: '',
                Address: '',
                Description: '',
                ActUserId: $rootScope.globals.user_id
            };
        };

        vm.submitDepartment = function (formDepartment) {
            if (formDepartment.$invalid) {
                angular.forEach(formDepartment.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            $service.Post('', 'phong-ban', 'save-department', vm.Department, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTreeDepartment();
                vm.initDepartmentDropDownList();
            });
        };

        vm.initDepartmentDropDownList = function () {
            var request = {
                Id: 1
            };
            debugger;
            $service.Post('', 'phong-ban', 'droplist-department', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                vm.dropDownlists = $response.Data;
            });
        };

        vm.Delete = function (id) {
            var request = {
                Id: id
            };
            debugger;
            $service.Post('', 'phong-ban', 'delete-department', request, function (response) {
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTreeDepartment();
                vm.initDepartmentDropDownList();
            });
        };

        function getDepartment_by_id(id) {
            debugger;
            var request = {
                Id: id
            };
            $service.Post('', 'phong-ban', 'get-department', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                vm.Department = {
                    Id: $response.Data.Id,
                    ParentId: $response.Data.ParentId,
                    IsUnit: $response.Data.IsUnit,
                    Acronym: $response.Data.Acronym,
                    ShortName: $response.Data.ShortName,
                    FullName: $response.Data.FullName,
                    PhoneNumber: $response.Data.PhoneNumber,
                    Email: $response.Data.Email,
                    Address: $response.Data.Address,
                    Description: $response.Data.Description,
                    ActUserId: $rootScope.globals.user_id
                };
            });
        };

        vm.initTreeDepartment = function () {
            debugger;
            var request = {
                Id : 1
            };
            $service.Post('', 'phong-ban', 'tree-department', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                $(".tree-container").empty();
                $(".tree-container").append('<div class="tree-default"><ul class= "d-none mb-0" ></ul ></div>');
                $('.tree-default').fancytree({
                    source: $response.Data,
                    checkbox: false,
                    selectMode: 3,
                    minExpandLevel: 0,
                    beforeExpand: function (event, data) {
                        return true;
                    },
                    click: function (event, data) {
                        debugger;
                        var node_key = parseInt(data.node.key);
                        getDepartment_by_id(node_key);
                    }
                });
            });
        };
        vm.initTreeDepartment();
        vm.initDepartmentDropDownList();
    }
})();