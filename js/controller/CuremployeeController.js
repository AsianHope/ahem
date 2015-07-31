(function () {
    'use strict';
    app.controller('CuremployeeCtrl',function ($scope,$http,$stateParams,$location,EmployeesService){
      $scope.id =$stateParams.instanceID;
      if($scope.employees.length==0){
        EmployeesService.getEmployees($scope.user.uname,$scope.user.pw)
            .success(function(data, status, headers, config) {
               if(data.result=='error'){
                  //pop us back out to the login screen
                 $scope.user.uname = null;
                 $scope.user.pw = null;
               }
               else{
                 $scope.employees = data;
                 // get curemployee
                for(var i=0; i<$scope.employees.length; i++){
                    if($scope.employees[i].employeeNumber==$scope.id){
                      $scope.curemployee=$scope.employees[i];
                      break;
                    }
                  }
                 }
               //end success
            })
            .error(function(data, status, headers, config){
                $scope.user.uname = null;
                $scope.user.pw = null;
             })
             .finally(function() {
               // called no matter success or failure
               $scope.loading = false;
             });
      }
      else{
        // get curemployee
       for(var i=0; i<$scope.employees.length; i++){
           if($scope.employees[i].employeeNumber==$scope.id){
             $scope.curemployee=$scope.employees[i];
             break;
           }
       }
      }
      $scope.shift = function(amount){
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.id){
                  $scope.curemployee = $scope.employees[i+amount];
                  $location.path("/admin/staff/"+$scope.curemployee.employeeNumber);
                  break;
              }
          }
      };
      $scope.clearEmployee = function(){
        $scope.curemployee=null;
     };

    });
  }());
