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