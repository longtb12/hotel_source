(function () {
    'use strict';

    angular
        .module('app')
        .factory('$service', index);

    index.$inject = ['$rootScope', '$http', '$state', 'blockUI'];

    function index($rootScope, $http, $state, blockUI) {
        var getSvcUrl = function (prefix, controller, method) {
            var $baseUrl = $rootScope.configs.api_end_point + "/v1.0";
            if (prefix !== undefined && prefix !== null && prefix !== '')
                $baseUrl = $baseUrl + "/" + prefix;
            return $baseUrl + "/" + controller + "/" + method;
        };
        //Post data json to api service
        var post = function (prefix, controller, method, data, successCallback) {
            //
            blockUI.start('Vui lòng chờ trong giây lát ...');
            //blockUI.template = '<img src="https://i.pinimg.com/originals/58/4b/60/584b607f5c2ff075429dc0e7b8d142ef.gif" />'
            //
            debugger;
            var auth_access = $rootScope.auth_access;
            //console.log(auth_access);
            var $timeStamp = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var $accessToken = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(auth_access));
            var $request = {};
            if (data !== null)
                $request.value = data;
            $request.AccessToken = $accessToken;
            $request.TimeStamp = $timeStamp;
            $request.Nonce = 0;
            //console.log("request:" + angular.toJson($request));
            //create auth access value
            var hash = CryptoJS.SHA256(angular.toJson($request)).toString();
            // get url api service
            var $url = getSvcUrl(prefix, controller, method);
            // add authorization header with jwt token if available            
            var $config = {
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json;odata=verbose",
                "Auth-Access": hash
            };
            // post data to api service
            $http({
                url: $url,
                method: "POST",
                data: $request,
                headers: $config
            }).then(function (response) {
                successCallback(response);
                //
                blockUI.stop();
            }, function (response) {
                    blockUI.stop();
                    debugger;
                    //
                    alert(response);
                if (response.status === 404) {
                    $state.go('login');
                    return;
                }
                alert(response.status + ": " + response.statusText + "\nHãy liên hệ với người quản trị hệ thống để nhận được hỗ trợ.");
            });
        };


        //Get data json to api service
        var get = function (prefix, controller, method, data, successCallback) {
            debugger;
            //
            blockUI.start('Vui lòng chờ trong giây lát ...');
            //blockUI.template = '<img src="https://i.pinimg.com/originals/58/4b/60/584b607f5c2ff075429dc0e7b8d142ef.gif" />'
            //
            var auth_access = $rootScope.auth_access;
            var $timeStamp = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var $accessToken = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(auth_access));
            var $request = {};
            if (data !== null)
                $request.value = data;
            $request.AccessToken = $accessToken;
            $request.TimeStamp = $timeStamp;
            $request.Nonce = 0;
            //create auth access value
            var hash = CryptoJS.SHA256(angular.toJson($request)).toString();
            // get url api service
            var $url = getSvcUrl(prefix, controller, method);
            // add authorization header with jwt token if available
            debugger;
            var $config = {
                "Content-Type": "application/json; charset=UTF-8",
                "Accept": "application/json",
                "Auth-Access": hash
            };
            // post data to api service
            $http({
                url: $url,
                method: "GET",
                params: $request,
                headers: $config
            }).then(function (response) {
                successCallback(response);
                debugger;
                //
                blockUI.stop();
            }, function (response) {
                    blockUI.stop();
                    debugger;
                //
                if (response.status === 404) {
                    $state.go('login');
                    return;
                    }
                    debugger;

                alert(response.status + ": " + response.statusText + "\nHãy liên hệ với người quản trị hệ thống để nhận được hỗ trợ.");
            });
        };
        //
        var upload = function (prefix, controller, method, formData, successCallback) {
            blockUI.start('Vui lòng chờ trong giây lát ...');
            //
            var $url = getSvcUrl(prefix, controller, method);
            //
            $http.post($url, formData, {
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).then(function (response) {
                successCallback(response);
                //
                blockUI.stop();
            }, function (response) {
                    blockUI.stop();
                    //
                if (response.status === 404) {
                    $state.go('login');
                    return;
                }
                alert(response.status + ": " + response.statusText + "\nHãy liên hệ với người quản trị hệ thống để nhận được hỗ trợ.");
            });
        };

        return {
            Post: post,
            Get:get,
            Upload: upload
        };
    }
})();