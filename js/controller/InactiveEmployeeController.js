(function () {
      'use strict';
      app.controller('InactiveEmployeeController',function($scope, $http, $q,EmployeesService) {
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"ALLINACTIVE")
            .then(
            // success
            function(results){
              $scope.inactiveEmployees = results.data;
              $scope.curInactiveEmployees = $scope.inactiveEmployees;
            })
            .finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });
      });
  }());
