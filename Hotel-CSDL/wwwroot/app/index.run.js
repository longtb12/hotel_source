(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope', '$timeout', '$state', '$transitions', '$location', '$http', 'appConfig'];

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $transitions, $location, $http, appConfig) {
        // keep user logged in after page refresh
        $rootScope.configs = appConfig;
        //$rootScope.globals = {
        //    user_id: 1,
        //    user_name: 'admin',
        //    user_full_name: 'Quản trị hệ thống',
        //    unit_id: 1,
        //    unit_name: 'UBND huyện Văn Bàn',
        //    department_id: 1,
        //    department_name: 'UBND huyện Văn Bàn',
        //    position_id: 1,
        //    position_name: 'Quản trị hệ thống',
        //};        

        $rootScope.gender = [
            { "id": 0, "name": "Nam" },
            { "id": 1, "name": "Nữ" },
            { "id": 2, "name": "Khác" }
        ];

        $rootScope.auth_access = sessionStorage.getItem('Auth-Access');
        if ($rootScope.auth_access && $rootScope.auth_access !== undefined && $rootScope.auth_access !== null && $rootScope.auth_access !== '') {
            
            $http.defaults.headers.common['Authorization'] = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Bearer ' + $rootScope.auth_access)); // jshint ignore:line
        }

        $transitions.onBefore({}, function(transition) {
            var actions = sessionStorage.getItem("right");
            var name = transition.to().name;
            //var data = [
            //    { key: "project-regist", value: "V_DKDA" }, { key: "project-pending", value: "V_DACPD" }, { key: "project-reject", value: "V_DSBTC" }, { key: "project-cancel", value: "V_DSBH" },
            //    { key: "project-processing", value: "V_DSDTH" }, { key: "project-finished", value: "V_DSDHT" }, { key: "tracking-pending", value: "V_DADPD" }, { key: "tracking-processing", value: "V_DADTH" },
            //    { key: "statistic-user", value: "V_TKTHCBPT" }, { key: "statistic-field", value: "V_TKTHLV" }, { key: "statistic-unit", value: "V_TKTHDV" },
            //    { key: "user", value: "V_QLND" }, { key: "department", value: "V_QLDVPB" }, { key: "role", value: "V_QLNND" }, { key: "function", value: "V_QLCN" }, { key: "calendar", value: "V_CHLLV" }, { key: "access-history", value: "V_LSTCHT" },
            //    { key: "position", value: "V_DMCD" }, { key: "field", value: "V_DMCLV" }, { key: "project-type", value: "V_DMPLDA" }, { key: "contractor", value: "V_DMNT" }
            //];
            //var value = "";
            //angular.forEach(data, function (item) {
            //    if (item.key == name) {
            //        value = item.value;
            //    }
            //});
            //if (!actions.includes(value) && name != "home") {
            //    return transition.router.stateService.target('home');
            //}
            //return true;
        });
        /* */
        $transitions.onStart({}, function ($transition) {
            var current = $transition.router.stateService.current;
            // redirect to login page if not logged in
            //alert("root change start");
            //alert(sessionStorage.getItem('globals'));


            var globals = JSON.parse(sessionStorage.getItem('globals')) || {};
            $rootScope.globals = globals;
            
        });
        /* */
        $transitions.onSuccess({}, function ($transition) {
            $('.datepicker').datetimepicker({
                format: 'DD/MM/YYYY'
            }).on('dp.change', function (ev) {
                $(this).trigger('input'); // Use for Chrome/Firefox/Edge
                $(this).trigger('change');
            });
            //
            var current = $transition.router.stateService.current;
            $rootScope.title = current.title;
            //
            //if (!sessionStorage.getItem('Auth-Access') && !$rootScope.redirectState && ($state.current.name !== 'help' || $state.current.name !== 'docs')) {
            //    if (current.name !== 'login') {
            //        $rootScope.redirectState = current.name;
            //        $rootScope.redirectParams = $state.params;
            //    }
            //    $state.go('login');
            //} else if (sessionStorage.getItem('Auth-Access') && $rootScope.redirectState) {
            //    $state.go($rootScope.redirectState, { id: $rootScope.redirectParams.id });
            //    $rootScope.redirectState = null;
            //    $rootScope.redirectParams = null;
            //}
        });
        // Store state in the root scope for easy access
        $rootScope.state = $state;
    }
})();