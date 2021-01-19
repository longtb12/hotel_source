(function () {
    'use strict';

    angular
        .module('app')
        .directive('confirm', confirm);

    confirm.$inject = [];

    function confirm() {
        // Usage:
        //     <confirm></confirm>
        // Creates:
        // 
        var directive = {
            restrict: 'EA',
            controller: ['$scope', function ($scope) {
                var vm = $scope;
                vm.model = [];
                vm.handler = 'pop1';
                vm.save = function () {
                    $("#pop1").modal("hide");
                    vm.$parent.addMember(vm.model);
                };
            }],
            templateUrl: './views/shared/directives/confirm/confirm.html'
        };
        return directive;
    }

})();