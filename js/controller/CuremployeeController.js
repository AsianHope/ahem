(function () {
    'use strict';
    app.controller('CuremployeeCtrl',function ($scope,$http,$stateParams,$location,EmployeesService){
      $scope.$watch('$viewContentLoaded', function(){
            componentHandler.upgradeAllRegistered();
      });
      $scope.id =$stateParams.instanceID;
      $scope.family_data=[];
      $scope.document=[];
      if($scope.employees.length==0){
        EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"CURSTAFF")
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
             if($scope.curemployee.documents==undefined){
               $scope.document = [];
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
               // if he/single, but have children
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
                    family_child_obj['id'] = $scope.family_data[$scope.family_data.length-1]['id']+1;;
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

      $scope.shift = function(amount){
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.id){
                  $scope.curemployee = $scope.employees[i+amount];
                  if($scope.curemployee.documents==undefined){
                    $scope.document = [];
                  }
                  else{
                    $scope.document = $scope.curemployee.documents;
                  }
                  if($scope.curemployee.family_data==undefined){
                    $scope.family_data=[];
                    // if he/she Married
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
                    // if he/single, but have children
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
                  $location.path("/admin/staff/"+$scope.curemployee.employeeNumber);
                  break;
              }
          }
      };
      $scope.clearEmployee = function(){
        $scope.curemployee=null;
     };
     $scope.updateFamilyData = function(data, id,field) {
         for(var i=0; i<$scope.family_data.length; i++){
           if($scope.family_data[i].id==id){
             $scope.family_data[i][field]=data;
             return JSON.stringify($scope.family_data);
           }
         }
       }
       //
        $scope.upload_sms = null;
        $scope.addImportFile = function() {
         var f = document.getElementById('file').files[0];
         var formData = new FormData();
         var files_exist =false;
         $scope.Document_exist=[];
         for (var i = 0; i<$scope.document.length; i++){
           if($scope.document[i]['DocumentID']==$scope.DocumentData.Documenttype.value){
             files_exist = true;
             $scope.Document_exist=$scope.document[i];
           }
         }
         if(files_exist==true){
          if (confirm("" + $scope.Document_exist.Description + " Document already exist! Do you want to replace it?")){
              formData.append('file', f);
              formData.append('uidnumber', $scope.curemployee.uidNumber);
              formData.append('loginName',$scope.curemployee.uid);
              formData.append('documentType',$scope.DocumentData.Documenttype.text);
              formData.append('filename',$scope.Document_exist.data);
                                 $http({method: 'POST', url: 'cgi-bin/upload.cgi',
                                  data: formData,
                                  headers: {'Content-Type': undefined},
                                  transformRequest: angular.identity})
                                 .success(function(data, status, headers, config) {
                                   JSON.stringify(data);
                                   var fileDirectory = data.file;
                                   if(data.result=='success'){
                                      for(var i=0; i<$scope.document.length; i++){
                                        if($scope.document[i].DocumentID==$scope.Document_exist.DocumentID){
                                          $scope.document[i]['data']=fileDirectory;
                                        }
                                      }
                                       $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.document));
                                       $scope.upload_sms='Replace file successfully!';
                                       document.getElementById("formUpload").reset();
                                   }
                                   else{
                                     $scope.upload_sms='Upload file fail!';
                                   }
                             })
                             .error(function(data, status, headers, config) {
                               $scope.upload_sms='Error!';
                             });
            }
          else{
            document.getElementById("formUpload").reset();

          }
         }
         else{
           formData.append('file', f);
           formData.append('uidnumber', $scope.curemployee.uidNumber);
           formData.append('loginName',$scope.curemployee.uid);
           formData.append('documentType',$scope.DocumentData.Documenttype.text);
           formData.append('filename',"");
                              $http({method: 'POST', url: 'cgi-bin/upload.cgi',
                               data: formData,
                               headers: {'Content-Type': undefined},
                               transformRequest: angular.identity})
                              .success(function(data, status, headers, config) {
                                JSON.stringify(data);
                                var fileDirectory = data.file;
                                if(data.result=='success'){
                                  // $scope.document=[];
                                var document_obj = {};
                                 document_obj['DocumentID'] = $scope.DocumentData.Documenttype.value;
                                 document_obj['data'] = fileDirectory;
                                 document_obj['Description'] =$scope.DocumentData.Documenttype.text;
                                 $scope.document.push(document_obj);

                                  $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.document));
                                  $scope.upload_sms='Upload file successfully!';
                                  document.getElementById("formUpload").reset();
                                }
                                else{
                                  $scope.upload_sms='Upload file fail!';
                                }
                          })
                          .error(function(data, status, headers, config) {
                            $scope.upload_sms='Error!';
                          });
         }
        };
    });
  }());
