(function () {
      'use strict';
      app.controller('LoginController',function ($scope,$http,storageService) {
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
