!function(){"use strict";function e(e,t,r,l,o){r.html5Mode({enabled:!0,requireBase:!0}),l.strictMode(!1),o.debugInfoEnabled(!0),angular.injector(["ngCookies"]).invoke(["$cookies",function(e){0}]),e.state("home",{url:"/",title:"Phần mềm quản lý khách sạn",templateUrl:"./views/home/index.html",controller:"HomeController"}).state("login",{url:"/dang-nhap",title:"Đăng nhập hệ thống",templateUrl:"./views/login/index.html",controller:"LoginController as vm"}),t.otherwise("/")}angular.module("app").config(e),e.$inject=["$stateProvider","$urlRouterProvider","$locationProvider","$urlMatcherFactoryProvider","$compileProvider"]}(),function(){"use strict";function e(e,t,r,l,o){r.html5Mode({enabled:!0,requireBase:!0}),l.strictMode(!1),o.debugInfoEnabled(!0);o="/he-thong";e.state("department",{url:o+"/phong-ban",title:"Quản lý hành chính",templateUrl:"./views/manager/department/index.html",controller:"DepartmentController"}).state("function",{url:o+"/chuc-nang",title:"Quản lý chức năng",templateUrl:"./views/manager/function/Index.html",controller:"FunctionController"}).state("position",{url:o+"/chuc-danh",title:"Quản lý chức danh",templateUrl:"./views/manager/position/position.html",controller:"PositionController"}).state("roomType",{url:o+"/loai-phong",title:"Quản lý loại phòng",templateUrl:"./views/manager/roomType/roomType.html",controller:"RoomTypeController"}).state("room",{url:o+"/phong",title:"Quản lý phòng",templateUrl:"./views/manager/room/room.html",controller:"RoomController"}).state("customer",{url:o+"/khach-hang",title:"Quản lý khách hàng",templateUrl:"./views/manager/customer/customer.html",controller:"CustomerController"}).state("user",{url:o+"/nguoi-dung",title:"Quản lý người dùng",templateUrl:"./views/manager/user/user.html",controller:"UserController"}).state("listusedgd",{url:o+"/danh-sach-kh-dang-su-dung",title:"Danh sách khách hàng đang sử dụng",templateUrl:"./views/manager/listUsedGD/index.html",controller:"ListUserGDController"}).state("listacceptgd",{url:o+"/danh-sach-kh-da-thanh-toan",title:"Danh sách khách hàng đã thanh toán",templateUrl:"./views/manager/listAcceptGD/index.html",controller:"ListAcceptGDController"}),t.otherwise("/")}angular.module("app.manager").config(e),e.$inject=["$stateProvider","$urlRouterProvider","$locationProvider","$urlMatcherFactoryProvider","$compileProvider"]}();