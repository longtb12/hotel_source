(function () {

    'use strict';
    angular.module('app.manager').controller('ListAcceptGDController', listacceptgd);

    listacceptgd.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function listacceptgd($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
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
            $service.Post('', 'pgiaodich', 'list-success', requests, function (response) {
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