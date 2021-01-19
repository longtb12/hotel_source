(function () {
    'use strict';


    angular.module('app.manager').controller('UserController', user);

    user.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function user($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;

        vm.departments = [];

        vm.user = {
            Id: 0,
            PositionId: null,
            DepartmentId: null,
            FirstName: '',
            LastName: '',
            UserName: '',
            Password: '',
            RePassword: '',
            Gender: null,
            BirthOfDay: '',
            PhoneNumber: '',
            Email: '',
            Address: '',
            IDCard: '',
            Status: 0
        };

        vm.userId = 0;
        vm.users = [];
        vm.total_page = 0;
        vm.departments = [];
        vm.positions = [];
        vm.request = {
            page_index: 1,
            page_size: 10
        }

        vm.titlePopupUser = '';

        vm.add_Role = function (Id) {
            var request = {
                UserId: Id,
                UserLoginId: $rootScope.globals.user_id
            };
            $service.Post('', 'nguoi-dung', 'permission', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.userId = Id;
                $('.tree-default-permission').fancytree({
                    source: $response.tree,
                    checkbox: true,
                    selectMode: 3,
                    minExpandLevel: 0,
                    beforeExpand: function (event, data) {
                        return true;
                    },
                    click: function (event, data) {
                        //var node_key = parseInt(data.node.key);
                        //edit(node_key);
                        //alert("Ok");
                        //
                        //get_by_id(node_key);
                    }
                });
                var tree = $(".tree-default-permission").fancytree("getTree");
                tree.reload($response.tree);
            });
            $("#actionOfUser").modal("show");
        };


        vm.submitRoles = function () {
            //var t = vm.Roles;
            //var request = {
            //    StaffEntityId: vm.StaffEntityId,
            //    Roles: vm.Roles,
            //    ActUserId: null
            //};
            var SelectedNodes = $('.tree-default-permission').fancytree('getTree').getSelectedNodes();
            var ListPermissionSelected = [];
            ListPermissionSelected = $.map($.grep(SelectedNodes, function (v) {
                return v.data.is_action == true;
            }), function (val, i) { return val.data.id; });
            var request = {
                UserLoginId: $rootScope.globals.user_id,
                UserId : vm.userId,
                listAction: ListPermissionSelected
            };
            debugger;
            $service.Post('', 'nguoi-dung', 'add-permission', request, function (response) {
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success("Thành công");
            });
        };


        //vm.request = {
        //    page_index: 1,
        //    page_size: 10
        //};
        vm.getdata = function (Id) {
            var requests = {
                Id: Id
            };
            debugger;
            $service.Post('', 'nguoi-dung', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.user = $response.user;
                vm.user.RePassword = vm.user.Password;
                var a = new Date(vm.user.BirthOfDay);
                var _month = a.getMonth() + 1;
                vm.user.BirthOfDay = "" + a.getDate() + "/" + _month + "/" + a.getFullYear() + "";
                vm.titlePopupUser = 'Sửa người dùng';
                $("#add_edit_user").modal("show");
            });
        };
        vm.init = function () {
            var request = {
                UserId: $rootScope.globals.user_id,
                DepartmentId: $rootScope.globals.department_id
            };
            debugger;
            $service.Post('', 'nguoi-dung', 'init', request, function (response) {
                debugger;
                var $response = response.data;
                if ($response.success == true) {
                    vm.departments = $response.dropDownList;
                    vm.positions = $response.positions.Data;
                    //
                    vm.users = $response.users;
                    var $source = $response.departmentTree;
                    //departmentTree
                    $('.tree-default').fancytree({
                        source: $source,
                        checkbox: false,
                        selectMode: 3,
                        minExpandLevel: 3,
                        beforeExpand: function (event, data) {
                            return true;
                        },
                        click: function (event, data) {
                            var nodeKey = data.node.key;
                            //
                            debugger;
                            vm.get_by_departmentid(parseInt(nodeKey));
                        }
                    });

                }
                else {
                    toastr.error($response.message);
                    return;
                }
            });
        };

        vm.get_by_departmentid = function (Id) {
            var request = {
                Id: Id
            };
            $service.Post('', 'nguoi-dung', 'get-by-department-id', Id, function (response) {
                var $response = response.data;
                if (!$response.success) {
                    toastr.error($response.message);
                    return;
                }
                //
                vm.users = $response.users;
                //
            });
        }

        vm.add_user = function () {
            vm.user = {
                Id: 0,
                PositionId: null,
                DepartmentId: null,
                FirstName: '',
                LastName: '',
                UserName: '',
                Password: '',
                RePassword: '',
                Gender: null,
                BirthOfDay: '',
                PhoneNumber: '',
                Email: '',
                Address: '',
                IDCard: '',
                Status: 0
            };
            vm.titlePopupUser = 'Thêm mới người dùng';
            $("#add_edit_user").modal("show");
        }

        vm.create = function () {
            vm.user = {
                Id: 0,
                PositionId: null,
                DepartmentId: null,
                FirstName: '',
                LastName: '',
                UserName: '',
                Password: '',
                RePassword: '',
                Gender: null,
                BirthOfDay: '',
                PhoneNumber: '',
                Email: '',
                Address: '',
                IDCard: '',
                Status: 0
            };
        }

        vm.deleted = function (Id) {
            swal({
                title: "Xóa người dùng",
                text: "Bạn đồng ý xóa người dùng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'nguoi-dung', 'delete', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {
                            toastr.error($response.Message);
                            return;
                        }
                        //
                        vm.init();
                        //
                        toastr.success('Xóa người dùng thành công.', '');
                    });
                }
            });

        }



        vm.submit = function (formUser) {
            if (formUser.$invalid) {
                angular.forEach(formUser.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            var t = vm.user.BirthOfDay.split('/');
            var dob = new Date(t[2], t[1] - 1, t[0]);

            //var request = {
            //    Id: vm.user.Id,
            //    PositionId: vm.user.PositionId,
            //    DepartmentId: vm.user.DepartmentId,
            //    FirstName: vm.user.FirstName,
            //    LastName: vm.user.LastName,
            //    UserName: vm.user.UserName,
            //    Password: vm.user.Password,
            //    Gender: vm.user.Gender,
            //    BirthOfDay: dob,
            //    PhoneNumber: vm.user.PhoneNumber,
            //    Email: vm.user.Email,
            //    Address: vm.user.Address,
            //    IDCard: vm.user.IDCard,
            //    Status: 0,
            //    pageIndex: vm.request.page_index,
            //    pageSize: vm.request.page_size
            //};
            var request = {
                Id: vm.user.Id,
                PositionId: vm.user.PositionId,
                DepartmentId: vm.user.DepartmentId,
                FirstName: vm.user.FirstName,
                LastName: vm.user.LastName,
                UserName: vm.user.UserName,
                Password: vm.user.Password,
                Gender: vm.user.Gender,
                BirthOfDay: formatDate(dob, 'yyyy-MM-dd HH:mm:ss'),
                PhoneNumber: vm.user.PhoneNumber,
                Email: vm.user.Email,
                Address: vm.user.Address,
                IDCard: vm.user.IDCard,
                Status: vm.user.Status,
                pageIndex: vm.request.page_index,
                pageSize: vm.request.page_size
            };

            debugger;
            $service.Post('', 'nguoi-dung', 'save-user', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                //
                //vm.users = $response.listdata;
                vm.init();
                $(".tree-default").fancytree("getTree").getNodeByKey('' + $response.Data + '').setActive();
                vm.get_by_departmentid($response.Data);
                ////
                $("#add_edit_user").modal("hide");
                toastr.success('Lưu người dùng thành công.', '');
            });
        };
        vm.init();
    }

})();


