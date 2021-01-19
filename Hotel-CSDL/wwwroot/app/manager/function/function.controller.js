(function () {

    'use strict';
    angular.module('app.manager').controller('FunctionController', index);

    index.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function index($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
        var vm = $scope;
        vm.dropDownlists = [];
        //vm.Actions = [];

        vm.Function = {
            Id: 0,
            ParentId: 0,
            Name: '',
            Icon: '',
            ActionLink: '',
            Status: 1,
            ShowInMenu: false,
            Description: '',
            ActUserId: $rootScope.globals.user_id,
            Actions: []
        };

        vm.Action = {
            Id: 0,
            Name: '',
            AreaName: '',
            ControllerName: '',
            ActionName: '',
            Method: '',
            Status: 1,
            Index: null,
            Code: ''
        };

        vm.add_action = function () {
            vm.Action = {
                Id: 0,
                Name: '',
                AreaName: '',
                ControllerName: '',
                ActionName: '',
                Method: '',
                Status: 1,
                Index: null,
                Code: ''
            };
            vm.form_action.$setPristine();
            $("#add_action_of_function").modal("show");
        };

        vm.delete_action = function (index) {
            delete vm.Function.Actions.splice(index, 1);
        };

        vm.edit_action = function (item) {
            item.Index = vm.Function.Actions.indexOf(item)
            vm.Action = angular.copy(item);
            vm.form_action.$setPristine();
            $("#add_action_of_function").modal("show");
        };

        vm.submit_action = function (form_action) {
            if (form_action.$invalid) {
                angular.forEach(form_action.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            if (vm.Action.Index == null) {
                vm.Function.Actions.push(angular.copy(vm.Action));
            } else {
                vm.Function.Actions[vm.Action.Index] = vm.Action;
            }

            vm.Action = {
                Id: 0,
                Name: '',
                AreaName: '',
                ControllerName: '',
                ActionName: '',
                Method: '',
                Status: 1,
                Index: null,
                Code: ''
            };
            vm.form_action.$setPristine();
        };

        vm.create = function () {
            vm.Function = {
                Id: 0,
                ParentId: 0,
                Name: '',
                Icon: '',
                ActionLink: '',
                Status: 1,
                ShowInMenu: true,
                Description: '',
                ActUserId: $rootScope.globals.user_id,
                Actions: []
            };
        };

        vm.submitFunction = function (formFunction) {
            if (formFunction.$invalid) {
                angular.forEach(formFunction.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            $service.Post('', 'chuc-nang', 'save-function', vm.Function, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTree();
                vm.initDropDownList();
            });
        };

        vm.initDropDownList = function () {
            var request = {
                Id: 1
            };
            debugger;
            $service.Post('', 'chuc-nang', 'droplist-function', request, function (response) {
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
            $service.Post('', 'chuc-nang', 'delete-function', request, function (response) {
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTree();
                vm.initDropDownList();
            });
        };

        vm.initTree = function () {
            debugger;
            var request = {
                Id: 1
            };
            $service.Post('', 'chuc-nang', 'chuc-nang-tree', request, function (response) {
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
                        getFunction(node_key);
                    }
                });
            });
        };

        function getFunction(id) {
            debugger;
            var request = {
                Id: id
            };
            $service.Post('', 'chuc-nang', 'get-function', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                vm.Function = {
                    Id: $response.Data.FunctionData.Id,
                    ParentId: $response.Data.FunctionData.ParentId,
                    Name: $response.Data.FunctionData.Name,
                    Icon: $response.Data.FunctionData.Icon,
                    ActionLink: $response.Data.FunctionData.ActionLink,
                    Status: 1,
                    ShowInMenu: $response.Data.FunctionData.ShowInMenu,
                    Description: $response.Data.FunctionData.Description,
                    ActUserId: $rootScope.globals.user_id,
                    Actions: $response.Data.Actions
                };
            });
        };

        vm.initTree();
        vm.initDropDownList();
    }
})();