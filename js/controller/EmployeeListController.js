(function () {
    'use strict';
    app.controller('EmployeeListController',function ($scope, $http, $filter, $q,$location,EmployeesService,storageService) {
      $scope.showlist=false;
      $scope.keyPress = function(){
        $scope.showlist=true;
      }
      $scope.keyPressBack = function(){
        $location.path("/admin");
      }
      $scope.keyclickshide = function(){
        $scope.showlist=false;
        document.getElementById("search").value = "";
        document.getElementById("search").focus();
      }
      $scope.clearform = function() {
        document.getElementById("search").value = "";
        document.getElementById("search").focus();
      }
      $scope.loading = true;
      $scope.local_data=[];
      $scope.curemployee=null;
      $scope.employees = [];
      $scope.email;
      $scope.current_pass;
      $scope.password;
      $scope.password = password;
      var keylist="abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&";
      var temp='';
      var plength=8;
      $scope.checkStorage = function ()
      {
        return localStorage.getItem('employees_local_data') !== null;
      }
       // taken from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
       $scope.tempPassword = function(){
           temp='';
           for (var i=0;i<plength;i++)
             temp+=keylist.charAt(Math.floor(Math.random()*keylist.length));
           $scope.password = temp;
       };
       $scope.tempPassword();
       /*---check if username and password = null don't run factory*/
       if($scope.user.uname!=null && $scope.user.pw!=null ){
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
        }
            // storageService.clearAll();
            if(localStorage.getItem('employees_local_data') !== null){
              // get localStorage data
                $scope.local_data= JSON.parse(storageService.get('employees_local_data'));
            }
            else{
                $scope.local_data=  $scope.employees;
            }
          $scope.range = function(n) {
            //  n.trim();
            return new Array(parseInt(n));
          };
        //no one selected initially
        $scope.setEmployee = function(setEmployee){
          $scope.curemployee=setEmployee;
        };
        //begin internal functions
        $scope.refreshEmployeeData = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"ALL")
                .success(function(data, status, headers, config) {
                  $scope.employees = data;
                })
                .finally(function() {
                // called no matter success or failure
                $scope.loading = false;
              });
        };

        $scope.showRequestedAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"REQUESTS")
              .success(function(data, status, headers, config) {
                $scope.employees = data;
              })
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });
          };

        $scope.showDisabledAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"DISABLED")
              .success(function(data, status, headers, config) {
                $scope.employees = data;
              })
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });
        };
        $scope.showInactiveAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"INACTIVE")
              .success(function(data, status, headers, config) {
                $scope.employees = data;
              })
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });
        };
        $scope.groups =[];
        $scope.curGroups = [];
        $scope.showGroup = function(uid){
          $scope.curGroups = [];
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"GROUPS")
              .success(function(data, status, headers, config) {
                $scope.groups = data;
                for(var i=0; i<$scope.groups.length; i++){
                  if($scope.groups[i]['memberUid']!= undefined){
                    for(var j=0;j<$scope.groups[i]['memberUid'].length;j++){
                      if($scope.groups[i]['memberUid'][j]==uid){
                        $scope.curGroups.push($scope.groups[i]);
                      }
                    }
                  }
                }
              })
              .finally(function() {
              $scope.loading = false;
            });
        };
        $scope.showAllGroups = function(){
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"GROUPS")
              .success(function(data, status, headers, config) {
                $scope.groups = data;
              })
              .finally(function() {
              $scope.loading = false;
            });
        };
      //rough approximation
      this.timeBetween = function(startDate, endDate){
        if (endDate === 'present') endDate=new Date();
        if (!startDate) return ('Please enter a start date');
        var start = new Date(startDate);
        var end = new Date(endDate);
        var diff = (end - start);

        //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
        var day = 1000 * 60 * 60 * 24;

        var years = Math.floor(diff/(365*day));
        if (years>=1) diff -= 365*years*day;

        var months = Math.floor(diff/(31*day));
        if(months>=1) diff-=31*months*day;

        var days= Math.floor(diff/day);

        return 'approximately '+years+' year(s), '+months+' month(s), '+days+' day(s)';
      };
      $scope.duration = function(startDate, endDate){
        if (endDate === 'present') endDate=new Date();
        var start = new Date(startDate);
        var end = new Date(endDate);
        var diff = (end - start);

        //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
        var day = 1000 * 60 * 60 * 24;

        var years = Math.floor(diff/(365*day));
        if (years>=1) diff -= 365*years*day;

        var months = Math.floor(diff/(31*day));
        if(months>=1) diff-=31*months*day;

        var days= Math.floor(diff/day);

        return +years+' year(s), '+months+' month(s)';
      };
      this.selectSelf = function(){
        for(var i=0; i<$scope.employees.length; i++){
          if($scope.employees[i].cn.localeCompare($scope.user.uname) == 0){
            this.selfselect=$scope.employees[i];
             break;
          }
        }
      };
      $scope.go = function ( path ) {
        $location.path( path );
      };
      $scope.updateUser = function(uid, field, data){
              var d = $q.defer();
              EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'users','null')
                  .success(function(data, status, headers, config){
                       if(data.result=="success"){
                           d.resolve();
                       }
                       else
                           d.resolve("There was an error");
                     }).
                     error(function(data, status, headers, config){
                           d.reject('Server error!');
                   });
                   return d.promise;
      }
      $scope.modifyGroupSms=null;
      $scope.removeUserFromGroup=function(uid,field,data){
        var d = $q.defer();
        EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','remove')
            .success(function(data, status, headers, config){
                 if(data.result=='success'){
                    $scope.modifyGroupSms="Remove employee from group success!";
                    d.resolve()
                 }
                 if(data.result=='no_such_attribute'){
                    $scope.modifyGroupSms="Remove employee Fail! Don't have this emplyee in group.";
                 }
                 if(data.result=="error"){
                    $scope.modifyGroupSms="Fail to remove employee from group!";
                    d.resolve("There was an error");
                  }
               }).
               error(function(data, status, headers, config){
                    d.reject('Server error!');
                  $scope.modifyGroupSms="Fail to remove employee from group!!";
             });
             return d.promise;
      }
      $scope.group_name=null;
      $scope.addUserToGroup = function(uid,field,data){
        var d = $q.defer();
        if(field!=null){
          EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','add')
              .success(function(data, status, headers, config){
                  if(data.result=="success"){
                      d.resolve();
                      $scope.modifyGroupSms="Add employee to group success!";
                  }
                  if(data.result=="value_exists"){
                    $scope.modifyGroupSms="Emplyee already exist in this group!";
                  }
                  if(data.result=="error"){
                       d.resolve("There was an error");
                       $scope.modifyGroupSms="Fail to add employee to group!";
                     }
                 }).
                 error(function(data, status, headers, config){
                       d.reject('Server error!');
                       $scope.modifyGroupSms="Fail to add employee to group!";
               });
            }
          else{
            $scope.modifyGroupSms="Please choose group!";
          }
               return d.promise;
      }
      $scope.resetPassword = function(uid,data,type,confirmpass){
              var d = $q.defer();
              if(confirmpass==$scope.user.pw){
                EmployeesService.resetPassword(uid,data,$scope.user.uname,$scope.user.pw,type)
                  .success(function(data, status, headers, config){
                         if(data.result== 'success'){
                            if(type=="youreset"){
                              d.resolve()
                              alert('Your password has been reset! Plase login again.');
                              $scope.user.uname = null;
                              $scope.user.pw = null;
                            }
                            else{
                              d.resolve()
                              alert("Password has been reset!");
                              $scope.current_pass="";
                            }
                         }
                         else{
                             d.resolve("There was an error");
                             alert('You don\'t have permission to update.');
                           }
                       }).
                       error(function(data, status, headers, config){
                             d.reject('Server error!');
                     });
                   }
                   else{
                     alert('Your current passwords do not match.');
                   }
                     return d.promise;
      }
      $scope.decodeAppleBirthday = function(applebirthday){
        if(applebirthday == null) return 'DOB'
        else{
            //if they replace the dob the data stored locally will have dashes in it.
            applebirthday=applebirthday.replace(/-/g,'')
            var year = applebirthday.substr(0,4)
            var month = applebirthday.substr(4,2)
            var day = applebirthday.substr(6,2)
            return year+'-'+month+'-'+day
        }


      }
      var staff=$scope.staff;

      $scope.genders = [
          {value: 'M', text: 'M'},
          {value: 'F', text: 'F'}
      ];

      $scope.departments= ah_departments;

      $scope.employeetypes= ah_employeetypes;

      //pull these from a database or API -
      //BUG WARNING: if value doesn't match index in array things will get wonky
      $scope.documentType=[
        {value: '0', text: 'Photo', required_by: 'all'},
        {value: '1', text: 'CV/Resume', required_by: 'all'},
        {value: '2', text: 'Statement of Faith', required_by: 'all'},
        {value: '3', text: 'Letter of Reference', required_by: 'all'},
        {value: '4', text: 'Child Protection Policy', required_by: 'all'},
        {value: '5', text: 'Background Check', required_by: 'all'},
        {value: '6', text: 'Offer Letter', required_by: 'all'},
        {value: '7', text: 'Employee Handbook Receipt', required_by: 'all'},
        {value: '8', text: 'Position Description', required_by: 'all'},
        {value: '9', text: 'Physical Examination Report', required_by: 'all'},
        {value: '10', text: 'Copy of Passport', required_by: 'all'},
        {value: '11', text: 'Copy of Visa', required_by: 'all'},
        {value: '12', text: 'Copy of ID', required_by: 'all'},
        {value: '13', text: 'W4', required_by: 'all'},
        {value: '14', text: 'Code of Ethics', required_by: 'all'},
        {value: '15', text: 'Employee Status Form', required_by: 'all'},
        {value: '16', text: 'Other Supporting Documentation', required_by: ''},
      ];
      $scope.DocumentData = {
         'DocumentType':{value: '0', text: 'Photo', required_by: 'all'},
         'uid':'',

      };
      $scope.showMissingDocs = function(doclist, required_docs){
        var tempid;
        var reqdocs = required_docs.slice();
        var missingdocs=[];
        if(!doclist) return required_docs;

        //get rid of all docs they have
        for(var i=0; i<doclist.length; i++){
          tempid=doclist[i].documentID;
          delete reqdocs[tempid];
        }

        for(var i=0; i<required_docs.length; i++){
          if(reqdocs[i]) missingdocs.push(reqdocs[i]);
        }

        return missingdocs;
      };
      $scope.maritalstatuses= [
          {value: 'Married', text: 'Married'},
          {value: 'Single', text: 'Single'}
      ];

      $scope.religions= [
          {value: 'Buddhist', text: 'Buddhist'},
          {value: 'Christian', text: 'Christian'},
          {value: 'Undeclared', text: 'Undeclared'},
      ];

      $scope.ahcountries = [
        {value: 'KH', text: 'Cambodia'},
        {value: 'US', text: 'USA'},
      ];

      $scope.countries = world_countries;
    });
}());
