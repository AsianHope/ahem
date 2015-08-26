(function () {
      'use strict';
      app.controller('LoginController',function ($scope,$http) {
        $scope.user = {
             uname: null,
             pw: null
           }
         $scope.login = function () {
              $scope.user.uname = $scope.username;
              $scope.user.pw = $scope.password;
              $scope.$watch('$viewContentLoaded', function(){
                    componentHandler.upgradeAllRegistered();
              });
         };
    });
}());
