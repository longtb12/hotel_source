(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$httpProvider', 'toastrConfig'];

    /** @ngInject */
    function config($httpProvider, toastrConfig) {
        // Put your custom configurations here
        $httpProvider.interceptors.push(['$q', function ($q) {
            return {
                'responseError': function (rejection) {
                    var defer = $q.defer();
                    if (rejection.status === 500 || rejection.status === -1) {
                        // window.location.href = '/pages/errors/error-500';
                        return;

                    } else if (rejection.status === 401) {
                        window.location.href = '/dang-nhap';
                    }
                    else {
                        defer.reject(rejection);
                        return defer.promise;
                    }
                }
            };
        }]);

        angular.extend(toastrConfig, {
            allowHtml: false,
            autoDismiss: false,
            closeButton: false,
            closeHtml: "<button>&times;</button>",
            containerId: "toast-container",
            extendedTimeOut: 1000,
            iconClasses: {
                error: "toast-error",
                info: "toast-info",
                success: "toast-success",
                warning: "toast-warning"
            },
            maxOpened: 0,
            messageClass: "toast-message",
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            onTap: null,
            positionClass: "toast-top-center",
            preventDuplicates: false,
            preventOpenDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: "body",
            templates: {
                progressbar: "directives/progressbar/progressbar.html",
                toast: "directives/toast/toast.html"
            },
            timeOut: 5000,
            titleClass: "toast-title",
            toastClass: "toast"
        });
    }
})();