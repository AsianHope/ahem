(function () {
    'use strict';
    app.controller('CuremployeeCtrl',function ($scope,$http,$stateParams,$location,EmployeesService,modalDialog){
      $scope.$watch('$viewContentLoaded', function(){
            componentHandler.upgradeAllRegistered();
      });
      $scope.ID =$stateParams.instanceID;
      $scope.otherDoc = {};
      $scope.show_photo=false;
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
                     if($scope.employees[i].employeeNumber==$scope.ID){
                       $scope.curemployee=$scope.employees[i];

                       // get documents
                       if($scope.curemployee.documents===undefined || $scope.curemployee.documents.length==0){
                         $scope.document =[];
                       }
                       else{
                         $scope.document = $scope.curemployee.documents;
                       }

                       // get other documents
                       if($scope.curemployee.OtherDocuments===undefined || $scope.curemployee.OtherDocuments.length==0){
                         $scope.other_documents =[];
                       }
                       else{
                         $scope.other_documents = $scope.curemployee.OtherDocuments;
                       }

                       for (var i = 0; i<$scope.document.length; i++){
                         if($scope.document[i]['DocumentID']==0){
                           $scope.show_photo = true;
                           break;
                         }
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
           if($scope.employees[i].employeeNumber==$scope.ID){
             $scope.curemployee=$scope.employees[i];

            //  get documents
             if($scope.curemployee.documents===undefined || $scope.curemployee.documents.length==0){
               $scope.document = [];
             }
             else{
               $scope.document = $scope.curemployee.documents;
             }

             // get other documents
             if($scope.curemployee.OtherDocuments===undefined || $scope.curemployee.OtherDocuments.length==0){
               $scope.other_documents =[];
             }
             else{
               $scope.other_documents = $scope.curemployee.OtherDocuments;
             }

             for (var i = 0; i<$scope.document.length; i++){
               if($scope.document[i]['DocumentID']==0){
                 $scope.show_photo = true;
                 break;
               }
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
              if($scope.employees[i].employeeNumber==$scope.ID){
                  $scope.curemployee = $scope.employees[i+amount];
                  if($scope.curemployee.documents===undefined || $scope.curemployee.documents.length==0){
                    $scope.document = [];
                  }
                  else{
                    $scope.document = $scope.curemployee.documents;
                  }

                  // get other documents
                  if($scope.curemployee.OtherDocuments===undefined || $scope.curemployee.OtherDocuments.length==0){
                    $scope.other_documents =[];
                  }
                  else{
                    $scope.other_documents = $scope.curemployee.OtherDocuments;
                  }

                  for (var i = 0; i<$scope.document.length; i++){
                    if($scope.document[i]['DocumentID']==0){
                      $scope.show_photo = true;
                      break;
                    }

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
    $scope.addImportFile = function() {
         var f = document.getElementById('file').files[0];
         $scope.files_exist =false;
         $scope.Document_exist=[];
         for (var i = 0; i<$scope.document.length; i++){


           if($scope.document[i]['DocumentID']==$scope.DocumentData.Documenttype.value && $scope.DocumentData.Documenttype.value!=16){
             $scope.files_exist = true;
             $scope.Document_exist=$scope.document[i];
           }
         }
         if($scope.DocumentData.Documenttype.value==16 || $scope.DocumentData.Documenttype=='16'){
           for (var i = 0; i<$scope.other_documents.length; i++){
             if($scope.other_documents[i]['Description']==$scope.otherDoc.otherDocDescript){
               $scope.files_exist = "duplicate";
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
                        for(var i=0; i<$scope.document.length; i++){
                          if($scope.document[i].DocumentID==$scope.Document_exist.DocumentID){
                            $scope.document[i]['data']=fileDirectory;
                          }
                        }
                         $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.document));
                         $scope.upload_sms='Replace file successfully!';
                         $("#formUpload").trigger('reset');
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
                     var document_obj = {};
                     if($scope.other_documents.length<1){
                       document_obj['DocumentID'] = 1;
                     }
                     else{
                       document_obj['DocumentID'] =$scope.other_documents[$scope.other_documents.length-1]['DocumentID']+1;
                     }
                     document_obj['data'] = fileDirectory;
                     document_obj['Description'] =$scope.otherDoc.otherDocDescript;
                     $scope.other_documents.push(document_obj);
                     $scope.updateUser($scope.curemployee.uid,'OtherDocuments',JSON.stringify($scope.other_documents));
                   }
                   else{
                      var document_obj = {};
                       document_obj['DocumentID'] = $scope.DocumentData.Documenttype.value;
                       document_obj['data'] = fileDirectory;
                       document_obj['Description'] =$scope.DocumentData.Documenttype.text;
                       $scope.document.push(document_obj);
                       $scope.updateUser($scope.curemployee.uid,'documents',JSON.stringify($scope.document));
                  }
                   $scope.upload_sms='Upload file successfully!';
                    $("#formUpload").trigger('reset');
                   //  show profile picture
                    for (var i = 0; i<$scope.document.length; i++){
                      if($scope.document[i]['DocumentID']==0){
                        $scope.show_photo = true;
                        break;
                      }
                    }
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
    });
  }());
