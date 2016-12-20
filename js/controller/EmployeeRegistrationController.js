(function () {
      'use strict';
      app.controller('EmployeeRegistrationController',function($scope, $http, $q,EmployeesService) {
        $scope.password = null;
        $scope.countries = world_countries;
        $scope.departments = ah_departments;

        $scope.keylistRe="abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&";
        $scope.tempRe='';
        $scope.plengthRe=8;
        //default values
        $scope.formdata = {
           'employeeType':'FT',
           'l':'KH',
           'c':'US',
           'apple-birthday':'1970-01-01',
           'departmentNumber':'UNK'
        };

        $scope.group = 'staff'
        $scope.added_groups = ['staff']
        $scope.add_groups = function(){
          // prevent duplicate value
          if ($scope.added_groups.indexOf($scope.group) == -1) {
            $scope.added_groups.push($scope.group)
          }
        }
        $scope.display_added_group = function(){
          return $scope.added_groups.toString().replace(/,/g, ", ")
        }

        //  taken from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
         $scope.tempPasswordRegister= function(){
            $scope.tempRe='';
             for (var i=0;i<$scope.plengthRe;i++)
             $scope.tempRe+=$scope.keylistRe.charAt(Math.floor(Math.random()*$scope.keylistRe.length));
             $scope.password = $scope.tempRe;
         };
         $scope.tempPasswordRegister();
         $scope.registerAccount = function(){
                 var d = $q.defer();
                 $scope.formdata['userPassword']=$scope.password;
                 $scope.formdata['groups'] = ""+$scope.added_groups+"";
                 EmployeesService.addEmployee($scope.formdata)
                    .then(
                        // success
                        function(results) {
                          if(results.data.result=='success'){
                            $scope.success_message = "Success!";

                            d.resolve()
                          }
                          else{
                            console.log(results.data)
                            d.resolve("There was an error");
                          }
                        },
                        // error
                       function(results){
                         d.reject('Server error!');
                       }
                     );
                 return d.promise;
         };
         $scope.resetRequestForm = function(){
           $scope.success_message = null;
           $scope.formdata = {'l':'KH'};
           $scope.added_groups = ['staff'];
           $scope.tempPasswordRegister();
         };
      });
  }());
