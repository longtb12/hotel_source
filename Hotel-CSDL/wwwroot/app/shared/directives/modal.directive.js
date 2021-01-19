(function () {
    'use strict';

    angular
        .module('app')
        .directive('modal', modal);

    function modal() {
        // Usage:
        //     <member></member>
        // Creates:
        // 
        var directive = {
            restrict: 'EA',
            controller: ['$scope', function($scope) {
                var vm = $scope;
                vm.model = [];
                vm.handler = 'pop1';
                vm.save = function () {
                    $("#pop1").modal("hide");
                    vm.$parent.addMember(vm.model);
                };
            }],
            templateUrl: './views/shared/directives/member.html',
            scope: {
                handler: '=lolo',
                users: '=userChilds'
            }
        };
        return directive;
    }

})();