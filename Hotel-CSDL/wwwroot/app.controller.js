(function () {
    'use strict';

    angular
        .module('app')
        .controller('IndexController', index);

    index.$inject = ['$scope', '$state', '$http', '$rootScope', 'appConfig', '$service', 'toastr'];

    /** @ngInject */
    function index($scope, $state, $http, $rootScope, appConfig, $service, toastr) {
        /* jshint validthis:true */
        var vm = $scope;
        vm.$state = $state;
        /* */
        (function activate() {
            if (sessionStorage.getItem('access-token')) {
                $http.defaults.headers.common['AccessToken'] = CryptoJS.AES.decrypt(sessionStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
            }
        })();
        vm.changePassword = function () {
            $("#change-password").modal("show");
        };
        vm.logOut = function () {
            $service.Post('', 'xac-thuc', 'dang-xuat', {}, function (response) {
                var $response = response.data;
                if (!$response.success) {
                    toastr.error($response.message);
                    return;
                }
                //
                sessionStorage.setItem("right", "");
                $rootScope.globals = {};
                //$rootScope.auth_access = null;        
                sessionStorage.setItem("globals", JSON.stringify($rootScope.globals));   
                sessionStorage.setItem("Auth-Access", "");
                toastr.success('Đăng xuất thành công');
                $state.go('login');
            });
            
        }
    }

})();

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

(function () {
    'use strict';


    angular.module('app.manager').controller('CustomerController', customer);

    customer.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function customer($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.customer = {
            Id: 0,
            Code: '',
            FirstName: '',
            LastName: '',
            IDCard: '',
            Email: '',
            PhoneNumber: '',
            Address: '',
            Gender: null,
            Description: ''
        };

        vm.customers = [];
        vm.total_page = 0;
        vm.roomTypes = [];
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
            debugger;
            $service.Post('', 'customer', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.customers = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.customer = {
                Id: 0,
                Code: '',
                FirstName: '',
                LastName: '',
                IDCard: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                Gender: null,
                Description: ''
            };
        }
        vm.submit = function (formCustomer) {
            if (formCustomer.$invalid) {
                angular.forEach(formCustomer.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.customer.Id,
                Code: vm.customer.Code,
                FirstName: vm.customer.FirstName,
                LastName: vm.customer.LastName,
                IDCard: vm.customer.IDCard,
                Email: vm.customer.Email,
                PhoneNumber: vm.customer.PhoneNumber,
                Address: vm.customer.Address,
                Gender: vm.customer.Gender,
                Description: vm.customer.Description
            };
            $service.Post('', 'customer', 'save', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                toastr.success('Lưu thành công !');
                vm.create();
                vm.init();
            });
        };
        vm.getdata = function GetById(Id) {
            var request = {
                Id: Id
            };
            debugger;
            $service.Post('', 'customer', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.customer = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa khách hàng",
                text: "Bạn đồng ý xóa khách hàng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'customer', 'deleted', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {

                            toastr.error($response.Message);
                            return;
                        }
                        toastr.success('Đã Xóa Thành Công.');
                        vm.create;
                        vm.init();
                    });
                }
            });

        };
        vm.init();
    }

})();



(function () {

    'use strict';
    angular.module('app.manager').controller('DepartmentController', index);

    index.$inject = ['$scope', '$state', '$http', '$rootScope', '$service', 'toastr', 'deviceDetector'];

    function index($scope, $state, $http, $rootScope, $service, toastr, deviceDetector) {
        var vm = $scope;
        vm.dropDownlists = [];
        vm.Department = {
            Id : 0,
            ParentId : 0,
            IsUnit: false,
            Acronym: '',
            ShortName: '',
            FullName: '',
            PhoneNumber: '',
            Email: '',
            Address: '',
            Description: '',
            ActUserId: $rootScope.globals.user_id
        };

        vm.create = function () {
            vm.Department = {
                Id: 0,
                ParentId: 0,
                IsUnit: false,
                Acronym: '',
                ShortName: '',
                FullName: '',
                PhoneNumber: '',
                Email: '',
                Address: '',
                Description: '',
                ActUserId: $rootScope.globals.user_id
            };
        };

        vm.submitDepartment = function (formDepartment) {
            if (formDepartment.$invalid) {
                angular.forEach(formDepartment.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            $service.Post('', 'phong-ban', 'save-department', vm.Department, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTreeDepartment();
                vm.initDepartmentDropDownList();
            });
        };

        vm.initDepartmentDropDownList = function () {
            var request = {
                Id: 1
            };
            debugger;
            $service.Post('', 'phong-ban', 'droplist-department', request, function (response) {
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
            $service.Post('', 'phong-ban', 'delete-department', request, function (response) {
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                toastr.success($response.Message);
                vm.create();
                vm.initTreeDepartment();
                vm.initDepartmentDropDownList();
            });
        };

        function getDepartment_by_id(id) {
            debugger;
            var request = {
                Id: id
            };
            $service.Post('', 'phong-ban', 'get-department', request, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {
                    toastr.error($response.Message);
                    return;
                }
                vm.Department = {
                    Id: $response.Data.Id,
                    ParentId: $response.Data.ParentId,
                    IsUnit: $response.Data.IsUnit,
                    Acronym: $response.Data.Acronym,
                    ShortName: $response.Data.ShortName,
                    FullName: $response.Data.FullName,
                    PhoneNumber: $response.Data.PhoneNumber,
                    Email: $response.Data.Email,
                    Address: $response.Data.Address,
                    Description: $response.Data.Description,
                    ActUserId: $rootScope.globals.user_id
                };
            });
        };

        vm.initTreeDepartment = function () {
            debugger;
            var request = {
                Id : 1
            };
            $service.Post('', 'phong-ban', 'tree-department', request, function (response) {
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
                        getDepartment_by_id(node_key);
                    }
                });
            });
        };
        vm.initTreeDepartment();
        vm.initDepartmentDropDownList();
    }
})();
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
(function () {
    'use strict';

    //app.manager
    //    .controller('PositionController', position);
    angular.module('app.manager').controller('PositionController', position);

    position.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function position($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.position = {
            Id: 0,
            Name: '',
            Status: 0,
            Description: ''
        };
        //
        vm.positions = [];
        vm.total_page = 0;
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
            debugger;
            $service.Post('', 'chuc-danh', 'get-pading-position', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.message);
                    return;
                }
                vm.positions = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.position = {
                Id: 0,
                Name: '',
                Status: 0,
                Description: ''
            };
        }
        vm.submit = function (formPosition) {
            if (formPosition.$invalid) {
                angular.forEach(formPosition.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.position.Id,
                Name: vm.position.Name,
                Description: vm.position.Description,
                Status: vm.position.Status
            };
            $service.Post('', 'chuc-danh', 'save-position', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.message);
                    return;
                }
                toastr.success('Lưu thành công !');
                vm.create();
                vm.init();
            });
        };
        vm.getdata = function GetById(Id) {
            var request = {
                Id: Id
            };
            //debugger;
            $service.Post('', 'chuc-danh', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.message);
                    return;
                }
                debugger;
                vm.position = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {
            
            swal({
                title: "Xóa chức danh",
                text: "Bạn đồng ý xóa chức danh này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'chuc-danh', 'deleted', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {

                            toastr.error($response.Message);
                            return;
                        }
                        toastr.success('Đã Xóa Thành Công.');
                        vm.create;
                        vm.init();
                    });
                }
            });

        };
        vm.init();
    }

})();
(function () {
    'use strict';


    angular.module('app.manager').controller('RoomController', room);

    room.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function room($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.room = {
            Id: 0,
            Name: '',
            RoomTypeId: 0,
            RoomTypeName: '',
            Code: 0,
            Description: ''
        };

        vm.rooms = [];
        vm.total_page = 0;
        vm.roomTypes = [];
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
            debugger;
            $service.Post('', 'room', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.rooms = $response.listdata.Data;
                vm.roomTypes = $response.roomTypes;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.room = {
                Id: 0,
                Name: '',
                RoomTypeId: 0,
                RoomTypeName: '',
                Code: 0,
                Description: ''
            };
        }
        vm.submit = function (formRoom) {
            if (formRoom.$invalid) {
                angular.forEach(formRoom.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.room.Id,
                Name: vm.room.Name,
                RoomTypeId: vm.room.RoomTypeId,
                Description: vm.room.Description
            };
            $service.Post('', 'room', 'save', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                toastr.success('Lưu thành công !');
                vm.create();
                vm.init();
            });
        };
        vm.getdata = function GetById(Id) {
            var request = {
                Id: Id
            };
            debugger;
            $service.Post('', 'room', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.room = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa phòng",
                text: "Bạn đồng ý xóa phòng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'room', 'deleted', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {

                            toastr.error($response.Message);
                            return;
                        }
                        toastr.success('Đã Xóa Thành Công.');
                        vm.create;
                        vm.init();
                    });
                }
            });

        };
        vm.init();
    }

})();



(function () {
    'use strict';

    
    angular.module('app.manager').controller('RoomTypeController', roomType);

    roomType.$inject = ['$scope', '$rootScope', '$http', 'appConfig', '$service', 'toastr', '$state'];
    function roomType($scope, $rootScope, $http, appConfig, $service, toastr, $state) {
        //if (!$rootScope.globals.id) {
        //    $state.go('login');
        //    return;
        //}
        var vm = $scope;
        vm.roomType = {
            Id: 0,
            Name: '',
            Code: 0,
            Price: 0,
            Description: ''
        };
        
        vm.roomTypes = [];
        vm.total_page = 0;
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
            debugger;
            $service.Post('', 'loai-phong', 'get-pading', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.success) {

                    toastr.error($response.Message);
                    return;
                }
                vm.roomTypes = $response.listdata.Data;
                vm.total_page = $response.total_page;
            });
        };
        vm.create = function () {
            vm.roomType = {
                Id: 0,
                Name: '',
                Code: 0,
                Price: 0,
                Description: ''
            };
        }
        vm.submit = function (formRoomType) {
            if (formRoomType.$invalid) {
                angular.forEach(formRoomType.$error.required, function (item) {
                    item.$pristine = false;
                });
                return;
            }
            debugger;
            var requests = {
                Id: vm.roomType.Id,
                Name: vm.roomType.Name,
                Price: vm.roomType.Price,
                Description: vm.roomType.Description
            };
            $service.Post('', 'loai-phong', 'save', requests, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                toastr.success('Lưu thành công !');
                vm.create();
                vm.init();
            });
        };
        vm.getdata = function GetById(Id) {
            var request = {
                Id: Id
            };
            debugger;
            $service.Post('', 'loai-phong', 'get-by-id', Id, function (response) {
                debugger;
                var $response = response.data;
                if (!$response.Success) {

                    toastr.error($response.Message);
                    return;
                }
                debugger;
                vm.roomType = $response.Data;
            });
        };
        vm.delete = function Deleted(Id) {

            swal({
                title: "Xóa loại phòng",
                text: "Bạn đồng ý xóa loại phòng này?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#2196f3",
                cancelButtonColor: "#fafafa",
                cancelButtonText: "Không",
                confirmButtonText: "Đồng ý",
                closeOnConfirm: false
            }).then(function (result) {
                if (result.value) {
                    $service.Post('', 'loai-phong', 'deleted', Id, function (response) {
                        var $response = response.data;
                        if (!$response.Success) {

                            toastr.error($response.Message);
                            return;
                        }
                        toastr.success('Đã Xóa Thành Công.');
                        vm.create;
                        vm.init();
                    });
                }
            });

        };
        vm.init();
    }

})();



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



(function () {
    'use strict';

    angular
        .module('app')
        .directive('actionUser', actionUser);

    actionUser.$inject = ['$window'];

    function actionUser($window) {
        // Usage:
        //     <action></action>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var actions = sessionStorage.getItem("right");
            if (!actions.includes(attrs.actionUser)) {
                element.remove();
            }
            
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('compareTo', compare);

    function compare() {
        return {
            require: "ngModel",
            scope: {
                compareTolValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {                
                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.compareTolValue;
                };

                scope.$watch("compareTolValue",
                    function () {                        
                        ngModel.$validate();
                    });
            }
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .directive('customOnChange', customOnChange);

    customOnChange.$inject = [];

    function customOnChange() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = scope.$eval(attrs.customOnChange);
                element.bind('change', onChangeFunc);
            }
        };
    }

})();
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
(function () {
    'use strict';

    angular
        .module('app')
        .directive('footerView', footer);

    function footer() {
        // Usage:
        //     <footer-view></footer-view>
        // Creates:
        // 
        var directive = {
            restrict: 'E',
            templateUrl: 'views/shared/footer/index.html'
        };
        return directive;
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('navbar', navbar);

    navbar.$inject = ['$rootScope', '$state'];

    function navbar($rootScope, $state) {
        // Usage:
        //     <navbar></navbar>
        // Creates:
        // 
        var directive = {};

        directive.restrict = 'E';
        directive.templateUrl = 'views/shared/navbar/index.html';

        return directive;
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('pagination', pagination);

    function pagination() {
        // Usage:
        //     <pagination></pagination>
        // Creates:
        // 
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = 'views/shared/pagination/index.html';
        directive.scope = {
            pageIndex: '=',
            totalItems: "=", // Tổng số lượng trang
            //displayItems: '=', -- Cấu hình số lượng item khi paging ở local
            //pagingSize: '=', -- Cấu hình số lượng size hiển thị của paging
            onClick: '&'
        };
        directive.controller = ['$scope', function ($scope) {
            $scope.paging = {};
            /** */
            function set_page(total_page, current_page) {
                debugger;
                var totalPages = [];
                var startPage, endPage;
                // default to first page
                current_page = current_page || 1;
                if (total_page <= 5) {
                    // less than 10 total pages so show all
                    startPage = 1;
                    endPage = total_page;
                } else {
                    // more than 10 total pages so calculate start and end pages
                    if (current_page <= 3) {
                        startPage = 1;
                        endPage = 5;
                    } else if (current_page + 2 >= total_page) {
                        startPage = total_page - 4;
                        endPage = total_page;
                    } else {
                        startPage = current_page - 3;
                        endPage = current_page + 2;
                    }
                }
                // create an array of pages to ng-repeat in the pager control
                //totalPages = _.range(startPage, endPage + 1);
                for (; startPage < endPage + 1; startPage++)
                    totalPages.push(startPage);
                //page_index = page_index || 1;
                //var startPage, endPage;
                //var totalPages = Math.ceil(total_page / itemPerPage);
                //if (totalPages <= $scope.pagingSize) {
                //    startPage = 1;
                //    endPage = totalPages;
                //} else {
                //    if (page_index + 1 >= totalPages) {
                //        startPage = totalPages - ($scope.pagingSize - 1);
                //        endPage = totalPages;
                //    } else {
                //        startPage = page_index - parseInt($scope.pagingSize / 2);
                //        startPage = startPage <= 0 ? 1 : startPage;
                //        endPage = (startPage + $scope.pagingSize - 1) <= totalPages ? (startPage + $scope.pagingSize - 1) : totalPages;
                //        if (totalPages === endPage) {
                //            startPage = endPage - $scope.pagingSize + 1;
                //        }
                //    }
                //}
                //var startIndex = (page_index - 1) * itemPerPage;
                //var endIndex = startIndex + itemPerPage - 1;
                //var index = startPage;
                //var pages = [];
                //for (; index < endPage + 1; index++)
                //    pages.push(index);
                $scope.paging.page_index = current_page;
                $scope.paging.total_page = total_page;
                $scope.paging.total_pages = totalPages;
            }
            $scope.set_page = function (page_index) {
                if (page_index < 1 || page_index > $scope.paging.total_page)
                    return;
                set_page($scope.totalItems, page_index);
                $scope.$parent.request.page_index = page_index;
                $scope.onClick();
            };
            $scope.init = function (page_index) {
                if (page_index < 1 || page_index > $scope.paging.total_page)
                    return;
                set_page($scope.totalItems, page_index);
            };
            $scope.$watch("totalItems", function (newValue, oldValue) {
                //This gets called when data changes.
                $scope.totalItems = newValue;
                set_page($scope.totalItems, $scope.$parent.request.page_index);
            });
            $scope.$watch("pageIndex", function (newValue, oldValue) {
                //This gets called when data changes.
                $scope.pageIndex = newValue;
                set_page($scope.totalItems, $scope.$parent.request.page_index);
            });
            /** */
            $scope.init(1);
        }];
        /** */
        return directive;
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('changePassword', changePassword);

    changePassword.$inject = ['$window'];

    function changePassword($window) {
        // Usage:
        //     <changePassword></changePassword>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA',
            templateUrl: './views/shared/directives/change-password/index.html',
            controller: ['$scope', '$service', 'toastr', '$rootScope', function ($scope, $service, toastr, $rootScope) {
                var vm = $scope;
                vm.request = {
                    new_password: null,
                    confirm_new_password: null,
                    created_user_name: $rootScope.globals.user_name
                };
                vm.submitChangePassword = function (form) {
                    if (form.$invalid) {
                        angular.forEach(form.$error.required, function (item) {
                            item.$pristine = false;
                        });
                        return;
                    }
                    $service.Post('he-thong', 'nguoi-dung', 'doi-mat-khau', vm.request, function (response) {
                        var $response = response.data;
                        if (!$response.success) {
                            toastr.error($response.message);
                            return;
                        }
                        toastr.success('Đổi mật khẩu thành công.', '');
                    });
                };
            }]
        };
        return directive;

        function link(scope, element, attrs) {
            //element.bind('click', function (e) {
            //    scope.$apply(function() { ;
            //        $("#change-password").modal("show");
            //    });
            //});
        }
    }

})();
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
(function () {
    'use strict';

    angular
        .module('app')
        .directive('schedule', schedule);

    schedule.$inject = [];

    function schedule($window) {
        // Usage:
        //     <schedule></schedule>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: true,
            templateUrl: './views/shared/directives/schedule/schedule.html',
            transclude: true,
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();