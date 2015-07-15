(function () {
    'use strict';

    var app= angular.module('employeeList');
    app.controller('LoginController',function ($scope,$http) {
      $scope.user = {
           uname: null,
           pw: null
         }
         $scope.login = function () {
              $scope.user.uname = $scope.username;
              $scope.user.pw = $scope.password;
         };
    });

}());
