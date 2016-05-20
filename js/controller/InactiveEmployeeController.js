(function () {
      'use strict';
      app.controller('InactiveEmployeeController',function($scope, $http, $q,EmployeesService) {
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"DISABLED")
            .then(
            // success
            function(results){
              $scope.inactiveEmployees = results.data;
              $scope.curInactiveEmployees = $scope.inactiveEmployees;
            });
            EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"INACTIVE")
              .then(
              // success
              function(results){
                if($scope.inactiveEmployees.length<0){
                  $scope.inactiveEmployees = results.data;
                }
                else{
                  for(var i = 0 ; i<results.data.length; i++){
                    $scope.inactiveEmployees.push(results.data[i]);
                  }
                }
                $scope.curInactiveEmployees = $scope.inactiveEmployees;

              })
              .finally(function() {
                  // called no matter success or failure
                  $scope.loading = false;
            });
      });
  }());
