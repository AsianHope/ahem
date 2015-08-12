(function () {
      'use strict';
      app.controller('EmployeeRegistrationController',function($scope, $http, $q,EmployeesService) {
        $scope.password;
        $scope.countries = world_countries;
        $scope.departments = ah_departments;

        $scope.password = password;

        var keylist="abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&";
        var temp='';
        var plength=8;
        //default values
        $scope.formdata = {
           'employeeType':'FT',
           'l':'KH',
           'c':'US',
           'apple-birthday':'1970-01-01',
           'departmentNumber':'UNK'
        };
         // taken from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
         $scope.tempPassword = function(){
             temp='';
             for (var i=0;i<plength;i++)
               temp+=keylist.charAt(Math.floor(Math.random()*keylist.length));
             $scope.password = temp;
         };

         $scope.tempPassword();

         $scope.registerAccount = function(){
                 var d = $q.defer();
                 $scope.formdata['userPassword']=$scope.password;
                 EmployeesService.addEmployee($scope.formdata)
                   .success(function(data, status, headers, config){
                     if(data.result== 'success'){
                         $scope.success_message = "Success!";
                         d.resolve()
                     }
                     else
                         d.resolve("There was an error");
                   })
                   .error(function(data, status, headers, config){
                         d.reject('Server error!');
                    });
                 return d.promise;
         };
         $scope.resetRequestForm = function(){
           $scope.success_message = null;
           $scope.formdata = {'l':'KH'};
           $scope.tempPassword();
         };
      });
  }());
