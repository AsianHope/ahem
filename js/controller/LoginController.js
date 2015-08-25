(function () {
      'use strict';
      app.controller('LoginController',function ($scope,$http,storageService,EmployeesService,$stateParams) {

         $scope.login = function () {
              $scope.user.uname = $scope.username;
              $scope.user.pw = $scope.password;
              $scope.$watch('$viewContentLoaded', function(){
                    componentHandler.upgradeAllRegistered();
              });
              EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"CURSTAFF")
                  .success(function(data, status, headers, config) {
                     if(data.result=='error'){
                        //pop us back out to the login screen
                       $scope.user.uname = null;
                       $scope.user.pw = null;
                     }
                     else{
                       $scope.employees_local_data=[];
                       $scope.employees = data;
                         for(var i=0; i<$scope.employees.length; i++){
                           var emplyeeobj = {};
                           emplyeeobj['employeeType'] = $scope.employees[i].employeeType;
                           emplyeeobj['departmentNumber'] = $scope.employees[i].departmentNumber;
                           emplyeeobj['employeeNumber'] = $scope.employees[i].employeeNumber;
                           emplyeeobj['givenName'] = $scope.employees[i].givenName;
                           emplyeeobj['sn'] = $scope.employees[i].sn;
                           emplyeeobj['mobile'] = $scope.employees[i].mobile;
                           emplyeeobj['mail'] = $scope.employees[i].mail;
                           emplyeeobj['title'] = $scope.employees[i].title;
                           $scope.employees_local_data.push(emplyeeobj);
                           // set localStorage data
                           storageService.save('employees_local_data',$scope.employees_local_data);
                           if(localStorage.getItem('employees_local_data') == null){
                             $scope.local_data= $scope.employees;
                           }
                           else{
                             $scope.local_data= JSON.parse(storageService.get('employees_local_data'));
                           }
                       }
                          //--------route pass by id--------
                       for(var i=0; i<$scope.employees.length; i++){
                         //view profile
                         if($scope.employees[i].cn.localeCompare($scope.user.uname) == 0){
                           $scope.selfselect=$scope.employees[i];
                           if($scope.selfselect.departmentNumber=="LIS"){
                             document.getElementById("table_th").style.backgroundColor = "#488FCC";
                             document.getElementById("demo-ribbon").style.backgroundColor = "#488FCC";
                             document.getElementById("demo-header").style.backgroundColor = "#488FCC";
                             document.getElementById("btn_profile").style.backgroundColor = "#488FCC";
                             document.getElementById("btn_print_card").style.backgroundColor = "#488FCC";
                             document.getElementById("btn_print_change").style.backgroundColor = "#488FCC";
                             document.getElementById("search").style.border = "1px solid #488FCC";
                             $('#change_text_color').css('color', '#488FCC');
                             $('#change_text_color a').css('color', '#488FCC');
                             $scope.style_anchor = function() {
                               return { "color": "#488FCC" };
                             }
                           }
                           else if ($scope.selfselect.departmentNumber=="AHIS") {
                             $scope.style_anchor = function() {
                               return { "color": "#26AF5F" };
                             }
                             $('.mail').css('color', '#26AF5F');
                             document.getElementById("table_th").style.backgroundColor = "#26AF5F";
                             document.getElementById("demo-ribbon").style.backgroundColor = "#26AF5F";
                             document.getElementById("demo-header").style.backgroundColor = "#26AF5F";
                             document.getElementById("btn_profile").style.backgroundColor = "#26AF5F";
                             document.getElementById("btn_print_card").style.backgroundColor = "#26AF5F";
                             document.getElementById("btn_print_change").style.backgroundColor = "#26AF5F";
                             document.getElementById("search").style.border = "1px solid #26AF5F";
                             $('#change_text_color').css('color', '#26AF5F');
                             $('#change_text_color a').css('color', '#26AF5F');
                         }
                         else {
                           $scope.style_anchor = function() {
                             return { "color": "#488FCC" };
                           }
                         }
                             break;
                         }
                       }
                       $scope.id =$stateParams.instanceID;
                       // get curemployee
                      for(var i=0; i<$scope.employees.length; i++){
                          if($scope.employees[i].employeeNumber==$scope.id){
                            $scope.curemployee=$scope.employees[i];
                            if($scope.curemployee.documents==undefined){
                              $scope.document =[];
                            }
                            else{
                              $scope.document = $scope.curemployee.documents;
                            }
                            if($scope.curemployee.family_data==undefined){
                              $scope.family_data=[];
                              if($scope.curemployee.maritalstatus =='Married'){
                                var family_data_obj = {};
                                family_data_obj['id'] = 0;
                                family_data_obj['relationship'] = "spouse";
                                family_data_obj['sn'] = "" ;
                                family_data_obj['givenName'] = "";
                                family_data_obj['C'] = "";
                                family_data_obj['VisaExpires'] = "";
                                family_data_obj['idnumber'] = "";
                                $scope.family_data.push(family_data_obj);
                                if($scope.curemployee.children!=null && $scope.curemployee.children>0){
                                  for(var j=0; j<$scope.curemployee.children; j++){
                                     var family_child_obj = {};
                                     family_child_obj['id'] = j+1;
                                     family_child_obj['relationship'] = "child";
                                     family_child_obj['sn'] ="" ;
                                     family_child_obj['givenName'] = "";
                                     family_child_obj['C'] = "";
                                     family_child_obj['VisaExpires'] = "";
                                     family_child_obj['idnumber'] = "";
                                     $scope.family_data.push(family_child_obj);
                                   }
                                }
                              }
                              // if he/single but have children
                              if($scope.curemployee.children>0 && $scope.curemployee.maritalstatus=='Single'){
                                  for(var j=0; j<$scope.curemployee.children; j++){
                                     var family_child_obj = {};
                                     family_child_obj['id'] = j+1;
                                     family_child_obj['relationship'] = "child";
                                     family_child_obj['sn'] ="" ;
                                     family_child_obj['givenName'] = "";
                                     family_child_obj['C'] = "";
                                     family_child_obj['VisaExpires'] = "";
                                     family_child_obj['idnumber'] = "";
                                     $scope.family_data.push(family_child_obj);
                                   }
                                }

                            }
                            else{
                              $scope.family_data=$scope.curemployee.family_data;
                              if($scope.curemployee.children>$scope.family_data.length-1){
                                var count_add = $scope.curemployee.children-(($scope.family_data.length-1));
                                for(var j=0; j<count_add; j++){
                                   var family_child_obj = {};
                                   family_child_obj['id'] = $scope.family_data[$scope.family_data.length-1]['id']+1;
                                   family_child_obj['relationship'] = "child";
                                   family_child_obj['sn'] ="" ;
                                   family_child_obj['givenName'] = "";
                                   family_child_obj['C'] = "";
                                   family_child_obj['VisaExpires'] = "";
                                   family_child_obj['idnumber'] = "";
                                   $scope.family_data.push(family_child_obj);
                                 }
                                 $scope.updateUser($scope.curemployee.uid,'family_data',JSON.stringify($scope.family_data));
                              }
                              else if($scope.curemployee.children<$scope.family_data.length-1){
                                var count_remove = ($scope.family_data.length-1)-$scope.curemployee.children;
                                $scope.family_data.splice(-count_remove);
                                $scope.updateUser($scope.curemployee.uid,'family_data',JSON.stringify($scope.family_data));
                              }
                              else{
                                $scope.family_data=$scope.curemployee.family_data;
                              }
                            }
                            break;
                          }
                        }
                     }
                  })
                  .error(function(data, status, headers, config){
                               $scope.user.uname = null;
                               $scope.user.pw = null;
                   })
                   .finally(function() {
                   // called no matter success or failure
                   $scope.loading = false;
                 });
         };
    });
}());
