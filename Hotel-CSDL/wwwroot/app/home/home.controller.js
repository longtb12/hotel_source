(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', home);

    home.$inject = ['$scope', '$state', 'toastr', '$rootScope', '$service'];

    function home($scope, $state, toastr, $rootScope, $service) {
        /* jshint validthis:true */
        var vm = $scope;
        vm.$state = $state;
        //console.log($rootScope.globals);
        /** */
        if (!$rootScope.globals.user_name) {
            $state.go('login');
            return;
        }
        /** */
        vm.searchBarClass = 'icon-circle-down2';
        vm.searchBarClickCount = 0;
        vm.rooms = [];

        vm.roomsSelect = [];

        vm.customer_gd = {
            Id: 0,
            Code: '',
            FirstName: '',
            LastName: '',
            Deposit: 0,
            IDCard: '',
            Email: '',
            PhoneNumber: '',
            Address: '',
            Gender: null,
            Description: '',
            Price: 0,
            gds: []
        }

        vm.gd = {
            StartDate: '',
            EndDate: '',
            RoomPrice: '',
            Price: '',
            Name: '',
            Id: '',
            index: null
        }

        vm.searchRequest = {
            StartDate: '',
            EndDate: ''
        }

        vm.init = function () {
            var dateNow = new Date();
            var day_ = dateNow.getDate();
            var month_ = dateNow.getMonth();
            var year = dateNow.getFullYear();
            var startDate = new Date(year, month_ , day_);
            var endDate = new Date(year, month_ , day_ + 1);
            var requests = {
                StartDate: formatDate(startDate, 'yyyy-MM-dd HH:mm:ss'),
                EndDate: formatDate(endDate, 'yyyy-MM-dd HH:mm:ss')
            };
            debugger;
            $service.Post('', 'home', 'get-menu', requests, function (response) {
                debugger;
                $("#AreaSearchInformation").hide();
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.rooms = $response.listdata;
                vm.roomsSelect = vm.rooms.filter(x => x.checkRoom == 0);
                for (var i = 0; i < vm.rooms.length; i++) {
                    var a = new Date(vm.rooms[i].StartDateGD);
                    var _month = a.getMonth() + 1;
                    vm.rooms[i].StartDateGD = "" + a.getDate() + "/" + _month + "/" + a.getFullYear() + "";
                    var b = new Date(vm.rooms[i].EndDateGD);
                    var _month = b.getMonth() + 1;
                    vm.rooms[i].EndDateGD = "" + b.getDate() + "/" + _month + "/" + b.getFullYear() + "";
                }
            });
        };

        vm.add_giaodich = function () {
            vm.customer_gd = {
                Id: 0,
                Code: '',
                FirstName: '',
                LastName: '',
                IDCard: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                Gender: null,
                Description: '',
                gds: []
            }
            $("#add_gd").modal("show");
        }

        vm.add_room_gd = function () {
            vm.gd = {
                StartDate: '',
                EndDate: '',
                RoomPrice: '',
                Price: '',
                Name: '',
                Id: '',
                index: null
            };
            vm.customer_gd.gds.push(vm.gd);
        }
        vm.change_room = function (item) {
            debugger;
            item.index = vm.customer_gd.gds.indexOf(item);
            var a = vm.roomsSelect.find(x => x.Id == item.Id);
            item.RoomPrice = a.RoomPrice;
            vm.change_date(item);
        };

        vm.change_date = function (item) {
            if (item.StartDate != '' && item.EndDate != '') {
                debugger;
                var t1 = item.StartDate.split('/');
                var startDate = new Date(t1[2], t1[1] - 1, t1[0]);
                var t2 = item.EndDate.split('/');
                var endDate = new Date(t2[2], t2[1] - 1, t2[0]);
                var t = endDate - startDate;
                t = t / 86400000
                if (t >= 1) {
                    item.Price = t * item.RoomPrice;
                    var price_ = 0;
                    for (var i = 0; i < vm.customer_gd.gds.length; i++) {
                        price_ = price_ + vm.customer_gd.gds[i].Price;
                    }
                    vm.customer_gd.Price = price_;
                }

            }
        }

        vm.delete_room = function (item) {
            vm.customer_gd.gds.split(1, item.index);
        }

        vm.submitSearch = function (formSearch) {
            if (formSearch.$invalid) {
                angular.forEach(formSearch.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            var t1 = vm.searchRequest.StartDate.split('/');
            var startDate = new Date(t1[2], t1[1] - 1, t1[0]);
            var t2 = vm.searchRequest.EndDate.split('/');
            var endDate = new Date(t2[2], t2[1] - 1, t2[0]);
            var requests = {
                StartDate: formatDate(startDate, 'yyyy-MM-dd HH:mm:ss'),
                EndDate: formatDate(endDate, 'yyyy-MM-dd HH:mm:ss')
            };
            debugger;
            $service.Post('', 'home', 'get-menu', requests, function (response) {
                debugger;
                $("#AreaSearchInformation").hide();
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.rooms = $response.listdata;
                vm.roomsSelect = vm.rooms.filter(x => x.checkRoom == 0);
                for (var i = 0; i < vm.rooms.length; i++) {
                    var a = new Date(vm.rooms[i].StartDateGD);
                    var _month = a.getMonth() + 1;
                    vm.rooms[i].StartDateGD = "" + a.getDate() + "/" + _month + "/" + a.getFullYear() + "";
                    var b = new Date(vm.rooms[i].EndDateGD);
                    var _month = b.getMonth() + 1;
                    vm.rooms[i].EndDateGD = "" + b.getDate() + "/" + _month + "/" + b.getFullYear() + "";
                }
            });
        };

        vm.show_hide_advance_search = function () {
            $("#AreaSearchInformation").slideToggle();
            vm.searchBarClickCount++;
            if (vm.searchBarClickCount % 2 === 0)
                vm.searchBarClass = 'icon-circle-down2';
            else
                vm.searchBarClass = 'icon-circle-up2';
        };

        vm.submit = function (form) {
            if (form.$invalid) {
                angular.forEach(form.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }

            var gDichs = [];

            for (var i = 0; i < vm.customer_gd.gds.length; i++) {
                var gd = {
                    StartDate: '',
                    EndDate: '',
                    Price: 0,
                    RoomId: 0
                };
                var t1 = vm.customer_gd.gds[i].StartDate.split('/');
                var a1 = new Date(t1[2], t1[1] - 1, t1[0]);
                gd.StartDate = formatDate(a1, 'yyyy-MM-dd HH:mm:ss');
                var t2 = vm.customer_gd.gds[i].EndDate.split('/');
                var a2 = new Date(t2[2], t2[1] - 1, t2[0]);
                gd.EndDate = formatDate(a2, 'yyyy-MM-dd HH:mm:ss');
                gd.Price = vm.customer_gd.gds[i].Price;
                gd.RoomId = vm.customer_gd.gds[i].Id;
                gDichs.push(gd);
            }

            var requests = {
                UserId: $rootScope.globals.user_id,
                Id: vm.customer_gd.Id,
                Code: vm.customer_gd.Code,
                FirstName: vm.customer_gd.FirstName,
                LastName: vm.customer_gd.LastName,
                Deposit: vm.customer_gd.Deposit,
                IDCard: vm.customer_gd.IDCard,
                Email: vm.customer_gd.Email,
                PhoneNumber: vm.customer_gd.PhoneNumber,
                Address: vm.customer_gd.Address,
                Gender: vm.customer_gd.Gender,
                Description: vm.customer_gd.Description,
                Price: vm.customer_gd.Price
                //giaoDichs: gDichs
            };
            var request = {
                UserId: $rootScope.globals.user_id,
                Id: vm.customer_gd.Id,
                Code: vm.customer_gd.Code,
                FirstName: vm.customer_gd.FirstName,
                LastName: vm.customer_gd.LastName,
                Deposit: vm.customer_gd.Deposit,
                IDCard: vm.customer_gd.IDCard,
                Email: vm.customer_gd.Email,
                PhoneNumber: vm.customer_gd.PhoneNumber,
                Address: vm.customer_gd.Address,
                Gender: vm.customer_gd.Gender,
                Description: vm.customer_gd.Description,
                Price: vm.customer_gd.Price,
                giaoDichs: gDichs
            };
            debugger;
            $service.Post('', 'home', 'save', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                $("#add_gd").hide();
                vm.init();
            });
        }


        vm.init();
    }
})();
