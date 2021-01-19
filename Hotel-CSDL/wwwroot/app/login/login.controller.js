(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', login);

    login.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function login($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
        /* jshint validthis:true */
        var vm = $scope;        
        vm.$state = $state;
        //
        vm.user_name = '';
        vm.password = '';
        vm.os = '';
        vm.os_version = '';
        vm.login_date = '';

        vm.activate = function () {
            //alert("Ok"+sessionStorage.getItem("globals"));
            if (!vm.form.$valid) {
                vm.form.$setSubmitted();
                return;
            }
            var device_detector = deviceDetector;
            //var test = vm.getIp();
            //debugger;
            //Check login_date
            var d = new Date();
            vm.login_date = d.toDateString();
            //
            var request = {
                UserName: vm.user_name,
                PassWord: vm.password,
                //ip_address: "unknow",
                //user_agent: device_detector.raw.userAgent,
                //os: device_detector.os,
                //browser_name: device_detector.browser,
                //device_name: device_detector.device,
                //os_version: device_detector.os_version,
                //browser_version: device_detector.browser_version,
                //login_date: vm.login_date
            };
            //
            $service.Post('', 'nguoi-dung', 'dang-nhap', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                if (typeof (Storage) !== "undefined") {
                    // Store    
                    $rootScope.globals = {
                        user_id: $response.Data.User.Id,
                        user_name: $response.Data.User.UserName,
                        //user_full_name: $response.data.full_name,
                        //unit_id: $response.data.unit_id,
                        //unit_name: $response.data.unit_name,
                        department_id: $response.Data.User.DepartmentId,
                        //department_name: $response.data.department_name,
                        //position_id: $response.data.position_id,
                        //position_name: $response.data.position_name
                    };
                    debugger;
                    sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));
                    sessionStorage.setItem("right", JSON.stringify($response.Data.rights));
                    sessionStorage.setItem("Auth-Access", $response.Data.AccessToken);
                    console.log("Auth-Access: " + $response.Data.AccessToken)
                    $rootScope.auth_access = $response.Data.AccessToken;
                    //console.log("Test $rootScope.auth_access" + $rootScope.auth_access);
                    console.log("Authorization: " + CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Bearer ' + $rootScope.auth_access)));
                    $http.defaults.headers.common['Authorization'] = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('Bearer ' + $rootScope.auth_access));
                    
                    // Retrieve
                   
                } else {
                    toastr.error('Trình duyệt không hỗ trợ sessionStorage');
                    return;
                }
                $state.go('home')               
            });
        }
        //vm.getIp = function () {
        //    var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        //    var returnIp = "";
        //    if (RTCPeerConnection) {
        //        var rtc = new RTCPeerConnection({
        //            iceServers: [{ urls: "stun:stun.services.mozilla.com" }],
        //            icetransportpolicy: "relay"
        //        });
        //        if (1 || window.mozRTCPeerConnection) {
        //            rtc.createDataChannel('', {
        //                reliable: false
        //            });
        //        };
        //        rtc.onicecandidate = function (evt) {
        //            debugger;
        //            if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
        //        };
        //        rtc.createOffer(function (offerDesc) {
        //            grepSDP(offerDesc.sdp);
        //            rtc.setLocalDescription(offerDesc);
        //        }, function (e) {
        //            console.warn("offer failed", e);
        //        });
        //        var addrs = Object.create(null);
        //        addrs["0.0.0.0"] = false;

        //        //function updateDisplay(newAddr) {
        //        //    if (newAddr in addrs) return;
        //        //    else addrs[newAddr] = true;
        //        //    var displayAddrs = Object.keys(addrs).filter(function (k) {
        //        //        return addrs[k];
        //        //    });
        //        //    debugger;
        //        //    returnIp = displayAddrs.join(" or perhaps ") || "n/a";
        //        //}

        //        function grepSDP(sdp) {
        //            var hosts = [];
        //            sdp.split('\r\n').forEach(function (line) {
        //                if (~line.indexOf("a=candidate")) {
        //                    var parts = line.split(' '),
        //                        addr = parts[4],
        //                        type = parts[7];
        //                    if (type === 'host') updateDisplay(addr);
        //                } else if (~line.indexOf("c=")) {
        //                    var parts = line.split(' '),
        //                        addr = parts[2];
        //                    updateDisplay(addr);
        //                }
        //            });
        //        }
                
        //    } else {
        //        return "unknow";
        //    };


        //    //if (RTCPeerConnection)(function () {
                
        //    //})();  
        //    //else {
                
        //    //}
        //};
    }

})();
