(function () {

    'use strict';
    angular.module('app.manager').controller('ListUserGDController', listusedgd);

    listusedgd.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function listusedgd($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
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
        vm.customers_gd = [];
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
            $service.Post('', 'pgiaodich', 'list-used', requests, function (response) {
                debugger;
                $("#AreaSearchInformation").hide();
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.customers_gd = $response.listdata;
                vm.total_page = $response.total_page;
            });
        };
        vm.get_by_id = function (Id) {
            $("#add_gd").modal("show");
            $service.Post('', 'pgiaodich', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.customer_gd = $response.data;
                vm.customer_gd.gds = $response.list;
                var price = 0;
                for (var i = 0; i < vm.customer_gd.gds.length; i++) {
                    var a = new Date(vm.customer_gd.gds[i].StartDate);
                    var _month = a.getMonth() + 1;
                    vm.customer_gd.gds[i].StartDate = "" + a.getDate() + "/" + _month + "/" + a.getFullYear() + "";
                    var b = new Date(vm.customer_gd.gds[i].EndDate);
                    var _month = b.getMonth() + 1;
                    vm.customer_gd.gds[i].EndDate = "" + b.getDate() + "/" + _month + "/" + b.getFullYear() + "";
                    price = price + vm.customer_gd.gds[i].Price;
                }
                vm.customer_gd.Price = price;
            });
        }
        vm.paid = function (Id) {
            $service.Post('', 'pgiaodich', 'paid', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                $("#add_gd").hide();
                vm.init();
            });
        }
        vm.init();
        vm.show_hide_advance_search = function () {
            $("#AreaSearchInformation").slideToggle();
            vm.searchBarClickCount++;
            if (vm.searchBarClickCount % 2 === 0)
                vm.searchBarClass = 'icon-circle-down2';
            else
                vm.searchBarClass = 'icon-circle-up2';
        };
    }
})();