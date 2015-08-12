(function () {
    'use strict';
    app.controller('CuremployeeCtrl',function ($scope,$http,$stateParams,$location,EmployeesService){
      $scope.id =$stateParams.instanceID;
      $scope.family_data=[];
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
                      console.log($scope.curemployee);
                      if($scope.curemployee.C=="i"){
                        console.log("yes");
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
    });
  }());
