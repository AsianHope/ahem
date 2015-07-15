(function () {
    'use strict';

    var app= angular.module('employeeList');
    app.config(['$routeProvider',
    function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/simpleuser.html'
      }).
      when('/admin', {
        templateUrl: 'templates/admin.html'
      }).
      when('/admin/staff/:id', {
        templateUrl: 'templates/ViewStaffProfile.html',
        controller:'EmployeeListController'
      }).
      otherwise({
        templateUrl: 'templates/simpleuser.html'
      });
    }]);
}());
