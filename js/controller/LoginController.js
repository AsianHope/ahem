(function () {
      'use strict';
      app.controller('LoginController',function ($scope,$http,$location,$window,$rootScope) {
        $rootScope.permission_denied = false
        $rootScope.user = {
             uname: null,
             pw: null,
             isAdmin:false,
           }

        var user_session = JSON.parse($window.sessionStorage.getItem('user'));
        if(user_session!=null){
          if(user_session.password != undefined && user_session.password !=null){
            $rootScope.user.uname =user_session.username;
            $rootScope.user.pw = user_session.password;
          }
        }

        $scope.login = function () {
              $rootScope.user.uname = $scope.username;
              $rootScope.user.pw = $scope.password;
       };
       $scope.back_to_home = function(){
         $rootScope.permission_denied = false
         $location.path("/");
       }
       $scope.logout = function(){
         $window.location.reload()
         sessionStorage.removeItem('user')
       }
    });
}());
