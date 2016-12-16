(function () {
    'use strict';
    app.controller('CuremployeeCtrl',function ($scope,$http,$stateParams,$location,EmployeesService,modalDialog){
      $scope.$watch('$viewContentLoaded', function(){
            componentHandler.upgradeAllRegistered();
      });
      $scope.modifyGroupSms=null;
      $scope.ID =$stateParams.instanceID;
      $scope.otherDoc = {};
      $scope.loading = true;
      $scope.family_data=[];
      $scope.document=[];
      $scope.other_documents=[];
      $scope.upload_sms = null;
      $scope.files_exist= false;
      $scope.Document_exist=[];
      if($scope.employees.length==0){
        EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"CURSTAFF")
          .then(
              // success
              function(results) {
                if(results.data.result=='error'){
                    //pop us back out to the login screen
                  $scope.user.uname = null;
                  $scope.user.pw = null;
                }
                else {
                  $scope.employees = results.data;
                  // get curemployee
                 for(var i=0; i<$scope.employees.length; i++){
                     if($scope.employees[i].uidNumber==$scope.ID){
                       $scope.curemployee=$scope.employees[i];
                       $scope.showGroup($scope.curemployee.uid);

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
              },
              // error
              function(results){
               $scope.user.uname = null;
               $scope.user.pw = null;
             })
             .finally(function() {
               // called no matter success or failure
               $scope.loading = false;
             });

            //  get current employee in inactive employee
             EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"INACTIVE")
               .then(
                   // success
                   function(results) {
                     if(results.data.result=='error'){
                         //pop us back out to the login screen
                       $scope.user.uname = null;
                       $scope.user.pw = null;
                     }
                     else {
                       $scope.inactiveEmployees = results.data;
                       // get curemployee
                      for(var i=0; i<$scope.inactiveEmployees.length; i++){
                          if($scope.inactiveEmployees[i].uidNumber==$scope.ID){
                            $scope.curemployee=$scope.inactiveEmployees[i];

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
                   },
                   // error
                   function(results){
                    $scope.user.uname = null;
                    $scope.user.pw = null;
                  })
                  .finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                  });
      }
      // if have employees data
      else{
        // get curemployee
       for(var i=0; i<$scope.employees.length; i++){
           if($scope.employees[i].uidNumber==$scope.ID){
             $scope.curemployee=$scope.employees[i];
             $scope.showGroup($scope.curemployee.uid)

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
               if($scope.curemployee.maritalstatus=='Married'){
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
             }
             break;
           }
       }
      //  current employee in INACTIVE staff
      for(var i=0; i<$scope.inactiveEmployees.length; i++){
          if($scope.inactiveEmployees[i].uidNumber==$scope.ID){
            $scope.curemployee=$scope.inactiveEmployees[i];

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
              if($scope.curemployee.maritalstatus=='Married'){
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
            }
            break;
          }
      }
      }

      $scope.shift = function(amount){
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].uidNumber==$scope.ID){
                $scope.curemployee = $scope.employees[i+amount];

                if($scope.curemployee!=undefined){
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
                  $location.path("/admin/staff/"+$scope.curemployee.uidNumber);
                  break;
              }
            }
          }
          // =================
          // get current employee in inactive staff
          for(var i=0; i<$scope.inactiveEmployees.length; i++){
              if($scope.inactiveEmployees[i].uidNumber==$scope.ID){
                  $scope.curemployee = $scope.inactiveEmployees[i+amount];
                if($scope.curemployee!=undefined){
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
                  $location.path("/admin/staff/"+$scope.curemployee.uidNumber);
                  break;
              }
            }
          }

          // ==================
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
    $scope.addImportFile = function() {
         var f = document.getElementById('file').files[0];
         $scope.files_exist =false;
         $scope.Document_exist=[];
         if($scope.curemployee.documents != undefined){
           for (var i = 0; i<$scope.curemployee.documents.length; i++){
             if($scope.curemployee.documents[i]['DocumentID']==$scope.DocumentData.Documenttype.value && $scope.DocumentData.Documenttype.value!=16){
               $scope.files_exist = true;
               $scope.Document_exist=$scope.curemployee.documents[i];
               break;
             }
           }
         }
         if($scope.DocumentData.Documenttype.value==16 || $scope.DocumentData.Documenttype=='16'){
           if($scope.curemployee.OtherDocuments != undefined){
             for (var i = 0; i<$scope.curemployee.OtherDocuments.length; i++){
               if($scope.curemployee.OtherDocuments[i]['Description']==$scope.otherDoc.otherDocDescript){
                 $scope.files_exist = "duplicate";
                 break;
               }
             }
           }
         }
         if($scope.files_exist=='duplicate'){
           alert("Other Documents Description Already Exist! Please Change Description.");
           jQuery("#otherDoc").select();
         }
         else if($scope.files_exist==true){
           if (modalDialog.confirm("" + $scope.Document_exist.Description + " Document already exist! Do you want to replace it?")==true){
                EmployeesService.uploadFile(f, $scope.curemployee.uidNumber,$scope.curemployee.uid,$scope.DocumentData.Documenttype.text,$scope.DocumentData.Documenttype.value,$scope.Document_exist.data,"")
                .then(
                    // success
                    function(results) {
                      var fileDirectory = results.data.file;
                      if(results.data.result=='success'){
                        for(var i=0; i<$scope.curemployee.documents.length; i++){
                          if($scope.curemployee.documents[i].DocumentID==$scope.Document_exist.DocumentID){
                            $scope.curemployee.documents[i]['data']=fileDirectory;
                          }
                        }
                         $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.curemployee.documents));
                         $scope.upload_sms='Replace file successfully!';
                         $("#formUpload").trigger('reset');
                      }
                      else if (results.data.result=='photo_not_allow') {
                        $scope.upload_sms='Upload file fail. Photo allow jpg only !';
                      }
                      else{
                        $scope.upload_sms='Upload file fail!';
                      }
                    },
                    // error
                   function(results){
                     $scope.upload_sms='Server error!';
                   });
            }
            else{
              $("#formUpload").trigger('reset');
            }
         }
         else{
           EmployeesService.uploadFile(f, $scope.curemployee.uidNumber,$scope.curemployee.uid,$scope.DocumentData.Documenttype.text,$scope.DocumentData.Documenttype.value,"",$scope.otherDoc.otherDocDescript)
           .then(
               // success
               function(results) {
                 var fileDirectory = results.data.file;
                 if(results.data.result=='success'){
                   //  add other documents
                   if($scope.DocumentData.Documenttype.value==16){
                      //  prevent add duplicate document
                      var check = false;
                      if($scope.curemployee.OtherDocuments!=undefined && $scope.curemployee.OtherDocuments.length>0 ){
                        for (var i = 0; i<$scope.curemployee.OtherDocuments.length; i++){
                          if($scope.curemployee.OtherDocuments[i]['Description']==$scope.otherDoc.otherDocDescript){
                            check = true;
                            break;
                          }
                          else{
                            check = false;

                          }
                        }
                        // if other document exist do not add new document
                        if(check==true){
                          $scope.updateUser($scope.curemployee.uid,'OtherDocuments',JSON.stringify($scope.curemployee.OtherDocuments));
                        }
                        else{
                          var document_obj = {};
                          document_obj['DocumentID'] =$scope.curemployee.OtherDocuments[$scope.curemployee.OtherDocuments.length-1]['DocumentID']+1;
                          document_obj['data'] = fileDirectory;
                          document_obj['Description'] =$scope.otherDoc.otherDocDescript;
                          $scope.curemployee.OtherDocuments.push(document_obj);
                          $scope.updateUser($scope.curemployee.uid,'OtherDocuments',JSON.stringify($scope.curemployee.OtherDocuments));
                        }
                      }
                      // if other document not defined add other document
                      else{
                        $scope.curemployee.OtherDocuments = [];
                        var document_obj = {};
                        document_obj['DocumentID'] = 1;
                        document_obj['data'] = fileDirectory;
                        document_obj['Description'] =$scope.otherDoc.otherDocDescript;
                        $scope.curemployee.OtherDocuments.push(document_obj);
                        $scope.updateUser($scope.curemployee.uid,'OtherDocuments',JSON.stringify($scope.curemployee.OtherDocuments));
                      }
                   }
                   else{
                    //  prevent add duplicate document
                     var check = false;
                     if($scope.curemployee.documents!=undefined  && $scope.curemployee.documents.length>0){
                       for (var i = 0; i<$scope.curemployee.documents.length; i++){
                         if($scope.curemployee.documents[i]['DocumentID']==$scope.DocumentData.Documenttype.value){
                           check = true;
                           break;
                         }
                         else{
                           check = false;
                         }
                       }
                      //  if document exist
                       if(check==true){
                         $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.curemployee.documents));
                       }
                      //  if document not exist add document
                       else{
                         var document_obj = {};
                         document_obj['DocumentID'] = $scope.DocumentData.Documenttype.value;
                         document_obj['data'] = fileDirectory;
                         document_obj['Description'] =$scope.DocumentData.Documenttype.text;
                         $scope.curemployee.documents.push(document_obj);
                         $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.curemployee.documents));
                       }
                     }
                     else{
                       $scope.curemployee.documents = [];
                       var document_obj = {};
                       document_obj['DocumentID'] = $scope.DocumentData.Documenttype.value;
                       document_obj['data'] = fileDirectory;
                       document_obj['Description'] =$scope.DocumentData.Documenttype.text;
                       $scope.curemployee.documents.push(document_obj);
                       $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.curemployee.documents));
                     }
                  }
                   $scope.upload_sms='Upload file successfully!';
                    $("#formUpload").trigger('reset');
                 }
                 else if (results.data.result=='photo_not_allow') {
                   $scope.upload_sms='Upload file fail. Photo allow jpg only !';
                 }
                 else {
                   $scope.upload_sms='Upload file fail!';
                 }

               },
               // error
              function(results){
                $scope.upload_sms='Server error!';
              });
         }
        };
        $scope.combinedDocument = function(document,current_document){
          var document_result;
          if(current_document!=undefined && current_document.length>0){
            for(var i=0; i<current_document.length; i++){
               if(document.value == current_document[i]['DocumentID']){
                   document_result= "✓ " + document.text;
                   break;
               }
               else {
                   document_result= "✗ " + document.text;
               }
            }
          }
            else {
              document_result= "✗ " + document.text;
            }
          return document_result;

        };
        // ------------------- add and remove group------------------
        $scope.removeUserFromGroup=function(uid,field,data){
          EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','remove')
               .then(
                   // success
                   function(results) {
                     if(results.data.result=='success'){
                       $scope.modifyGroupSms="Remove employee from group success!";
                       $scope.showGroup(uid);
                     }
                     else if(results.data.result=='no_such_attribute'){
                       $scope.modifyGroupSms="Remove employee Fail! Don't have this emplyee in group.";
                     }
                     else{
                        $scope.modifyGroupSms="Fail to remove employee from group! "+results.data.result +".";
                      }
                   },
                   // error
                  function(results){
                    $scope.modifyGroupSms="Server error!";
                  });
        }
        $scope.addUserToGroup = function(uid,field,data){
          if(field!=null){
            EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','add')
                .then(
                    // success
                    function(results) {
                      if(results.data.result=='success'){
                        $scope.modifyGroupSms="Add employee to group success!";
                        $scope.showGroup(uid);
                      }
                      else if(results.data.result=='value_exists'){
                        $scope.modifyGroupSms="Emplyee already exist in this group!";
                      }
                      else{
                         $scope.modifyGroupSms="Fail to add employee to group! "+results.data.result +".";
                       }
                    },
                    // error
                   function(results){
                     $scope.modifyGroupSms="Server error!";
                   }
                 );
              }
            else{
              $scope.modifyGroupSms="Please choose group!";
            }
        }
    });
  }());
