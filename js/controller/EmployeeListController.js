(function () {
    'use strict';
    app.controller('EmployeeListController',function (DTOptionsBuilder,$scope, $http, $filter, $q,$location,EmployeesService,storageService) {
      $scope.objCheck = {
        checkedID : true,
        checkedGivenName : true,
        checkedSn : true,
        checkedGivenNamekh : true,
        checkedSnkh : true,
        checkedGender : true,
        checkedC : true,
        checkedAppleBirthday : true,
        checkedDepartmentNumber : true,
        checkedTitle : true,
        checkedEmployeeType : true,
        checkedL : true,
        checkedDegree : true,
        checkedIdnumber : true,
        checkedInsurance : true,
        checkedVisaExpires : true,
        checkedPostalAddress : true,
        checkedStartdate : true,
        checkedEnddate : true,
        checkedTerm : true,
        checkedMaritalStatus : true,
        checkedChildren : true,
        checkedFaith : true,
        checkedMobile : true,
        checkedMail : true,
        checkedMailpr : true
      };
      $scope.inactiveEmployeesCheck = {
        checkedID : true,
        checkedGivenName : true,
        checkedSn : true,
        checkedGivenNamekh : true,
        checkedSnkh : true,
        checkedGender : true,
        checkedC : true,
        checkedAppleBirthday : true,
        checkedDepartmentNumber : true,
        checkedTitle : true,
        checkedEmployeeType : true,
        checkedL : true,
        checkedDegree : true,
        checkedIdnumber : true,
        checkedInsurance : true,
        checkedVisaExpires : true,
        checkedPostalAddress : true,
        checkedStartdate : true,
        checkedEnddate : true,
        checkedTerm : true,
        checkedMaritalStatus : true,
        checkedChildren : true,
        checkedFaith : true,
        checkedMobile : true,
        checkedMail : true,
        checkedMailpr : true
      };
      // export
      this.dtOptions = DTOptionsBuilder
          .newOptions()
          .withTableTools('../../angular-datatables/vendor/datatables-tabletools/swf/copy_csv_xls_pdf.swf')
          .withTableToolsButtons([
              {
                  'sExtends': 'collection',
                  'sButtonText': 'Save',
                  'aButtons': ['xls']
              }
          ])
        this.dtOptionsShortOnly = DTOptionsBuilder
            .newOptions()
            .withOption('bFilter', false)
            .withOption('bPaginate', false)
            .withOption('bInfo',false)
      $scope.showlist=false;
      $scope.loading = true;
      $scope.local_data=[];
      $scope.curemployee=null;
      $scope.employees = [];
      $scope.employeesReport = [];
      $scope.current_pass=null;
      $scope.password;
      $scope.keylist="abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&";
      $scope.temp='';
      $scope.plength=8;
      $scope.DocumentData = {
         'DocumentType':{value: '0', text: 'Photo', required_by: 'all'},
         'uid':'',
      };
      $scope.years = {
         'selectedYear':null,
         'selectedYearEmployeeReport':null
      };
      // for search
      $scope.searchoption = {
         'filter':null,
         'key':null
      };
      $scope.searchoptionEmployeeReport = {
         'filter':null,
         'key':null
      };
      $scope.searchEmployeeReport = {};
      $scope.search = {};

      // for sort data
      $scope.orderByField = 'firstName';
      $scope.reverseSort = true;

      $scope.inactiveEmployees=[];

      $scope.groups =[];
      $scope.curGroups = [];
      $scope.modifyGroupSms=null;

      $scope.keyPress = function(){
        $scope.showlist=true;
      }
      $scope.keyPressBack = function(){
        $location.path("/admin");
      }
      $scope.keyclickshide = function(){
        $scope.showlist=false;
      }
      // cannot test with dom
      $scope.clearform = function() {
        document.getElementById("search").value = "";
        document.getElementById("search").focus();
      }
      // not yet test
      $scope.checkStorage = function ()
      {
        return localStorage.getItem('employees_local_data') !== null;
      }
       // taken from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
       $scope.tempPassword = function(){
         $scope.temp='';
           for (var i=0;i<$scope.plength;i++)
           $scope.temp+=$scope.keylist.charAt(Math.floor(Math.random()*$scope.keylist.length));
           $scope.password= $scope.temp;
       };

      $scope.tempPassword();
      EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"CURSTAFF")
        .then(
            // success
            function(results) {
              if(results.data.result=='error'){
                    //pop us back out to the login screen
                   $scope.user.uname = null;
                   $scope.user.pw = null;
              }
              else{
                  $scope.employees_local_data=[];
                  $scope.employees = results.data;
                  $scope.employeesReport = $scope.employees;
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
                        jQuery("#table_th,#demo-ribbon,#demo-header,#btn_profile,#btn_print_card,#btn_print_change").css('background-color', '#488FCC');
                        jQuery("#search").css('border', '1px solid #488FCC');
                        jQuery('#change_text_color,#change_text_color a').css('color', '#488FCC');
                        $scope.style_anchor = function() {
                          return { "color": "#488FCC" };
                        }
                      }
                      else if ($scope.selfselect.departmentNumber=="AHIS"){
                        jQuery("#table_th,#demo-ribbon,#demo-header,#btn_profile,#btn_print_card,#btn_print_change").css('background-color', '#26AF5F');
                        jQuery("#search").css('border', '1px solid #26AF5F');
                        jQuery('.mail,#change_text_color,#change_text_color a').css('color', '#26AF5F');
                        $scope.style_anchor = function() {
                          return { "color": "#26AF5F" };
                        }
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
            },
            // error
            function(results) {
              $scope.user.uname = null;
              $scope.user.pw = null;
            })
        .finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });
        EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"INACTIVE")
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
        // storageService.clearAll();
        if(localStorage.getItem('employees_local_data') !== null){
          // get localStorage data
          $scope.local_data= JSON.parse(storageService.get('employees_local_data'));
        }
        else{
          $scope.local_data=  $scope.employees;
        }
        $scope.range = function(n) {
          return new Array(parseInt(n));
        };
        // no one selected initially
        $scope.setEmployee = function(setEmployee){
          $scope.curemployee=setEmployee;
        };
        //begin internal functions
        $scope.refreshEmployeeData = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"ALL")
                .then(
                  // success
                  function(results){
                    $scope.employees = results.data;
                  }
                )
                .finally(function() {
                  // called no matter success or failure
                  $scope.loading = false;
              });
        };
        $scope.showRequestedAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"REQUESTS")
              .then(
                // success
                function(results){
                  $scope.employees = results.data;
                }
              )
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });
          };
        $scope.showDisabledAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"DISABLED")
              .then(
                // success
                function(results){
                  $scope.employees = results.data;
                }
              )
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });
        };
        $scope.showInactiveAccounts = function(){
          $scope.loading = true;
          $scope.employees = [];
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"INACTIVE")
              .then(
                // success
                function(results){
                  $scope.employees = results.data;
                }
              )
              .finally(function() {
              // called no matter success or failure
              $scope.loading = false;
            });

        };
        $scope.showGroup = function(uid){
          $scope.curGroups = [];
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"GROUPS")
              .then(
                // success
                function(results){
                  $scope.groups = results.data;
                  for(var i=0; i<$scope.groups.length; i++){
                    if($scope.groups[i]['memberUid']!= undefined){
                      for(var j=0;j<$scope.groups[i]['memberUid'].length;j++){
                        if($scope.groups[i]['memberUid'][j]==uid){
                          $scope.curGroups.push($scope.groups[i]);
                        }
                      }
                    }
                  }
                }
              )
              .finally(function() {
                $scope.loading = false;
              });
        };
        $scope.showAllGroups = function(){
          $scope.loading = true;
          EmployeesService.getEmployees($scope.user.uname,$scope.user.pw,"GROUPS")
              .then(
                // success
                function(results){
                  $scope.groups = results.data;
                }
              )
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
      // not use
      this.selectSelf = function(){
        for(var i=0; i<$scope.employees.length; i++){
          if($scope.employees[i].cn.localeCompare($scope.user.uname) == 0){
            this.selfselect=$scope.employees[i];
             break;
          }
        }
      };
      $scope.updateUser = function(uid, field, data){
              var d = $q.defer();
              EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'users','null')
                  .then(
                      // success
                      function(results) {
                        if(results.data.result=='success'){
                          d.resolve();
                        }
                        else{
                          d.resolve("There was an error");
                        }
                      },
                      // error
                     function(results){
                       d.reject('Server error!');
                     }
                   );
                   return d.promise;
      }
      $scope.removeUserFromGroup=function(uid,field,data){
        var d = $q.defer();
        EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','remove')
             .then(
                 // success
                 function(results) {
                   if(results.data.result=='success'){
                     $scope.modifyGroupSms="Remove employee from group success!";
                     d.resolve()
                   }
                   if(results.data.result=='no_such_attribute'){
                     $scope.modifyGroupSms="Remove employee Fail! Don't have this emplyee in group.";
                     d.resolve()
                   }
                   if(results.data.result=="error"){
                      $scope.modifyGroupSms="Fail to remove employee from group!";
                      d.resolve("There was an error");
                    }
                 },
                 // error
                function(results){
                  d.reject('Server error!');
                  $scope.modifyGroupSms="Server error!";
                });
             return d.promise;
      }
      $scope.addUserToGroup = function(uid,field,data){
        var d = $q.defer();
        if(field!=null){
          EmployeesService.updateEmployees(uid,field,data,$scope.user.uname,$scope.user.pw,'groups','add')
              .then(
                  // success
                  function(results) {
                    if(results.data.result=='success'){
                      $scope.modifyGroupSms="Add employee to group success!";
                      d.resolve();
                    }
                    if(results.data.result=='value_exists'){
                      $scope.modifyGroupSms="Emplyee already exist in this group!";
                      d.resolve();
                    }
                    if(results.data.result=="error"){
                       d.resolve();
                       $scope.modifyGroupSms="Fail to add employee to group!";
                     }
                  },
                  // error
                 function(results){
                   d.reject('Server error!');
                   $scope.modifyGroupSms="Server error!";
                 }
               );
            }
          else{
            $scope.modifyGroupSms="Please choose group!";
          }
          return d.promise;
      }
      $scope.resetPassword = function(uid,data,type,confirmpass){
              var d = $q.defer();
              // if Password match
              if(confirmpass==$scope.user.pw){
                EmployeesService.resetPassword(uid,data,$scope.user.uname,$scope.user.pw,type)
                  .then(
                      // success
                      function(results) {
                        if(results.data.result=='success'){
                          if(type=="youreset"){
                            d.resolve()
                            alert('Your password has been reset! Plase login again.');
                            // back to login page
                            $scope.user.uname = null;
                            $scope.user.pw = null;
                          }
                          else{
                            d.resolve()
                            alert("Password has been reset!");
                            $scope.current_pass="";
                          }
                        }

                        else {
                          d.resolve();
                          alert('You don\'t have permission to update.');
                        }
                      },
                      // error
                       function(results){
                         alert('Server error!');
                         d.reject('Server error!');
                       }
                   );
                   }
                  //  if password not match
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
      $scope.showMissingDocs = function(doclist,other_doc, required_docs){
        var tempid;
        var reqdocs = required_docs.slice();
        var missingdocs=[];
        if(doclist === undefined || doclist.length == 0)
        {
          if (other_doc === undefined || other_doc.length == 0) {
              return required_docs;
          }
          else {
            //get rid of other docs
            delete reqdocs['16'];
          }
        }
        else{
          //get rid of all docs they have
          for(var i=0; i<doclist.length; i++){
            tempid=doclist[i].DocumentID;
            delete reqdocs[tempid];
          }
          //get rid of other docs
          if (other_doc != undefined && other_doc.length > 0) {
            delete reqdocs['16'];
          }
        }
        for(var i=0; i<required_docs.length; i++){

          if(reqdocs[i]) missingdocs.push(reqdocs[i]);
        }
        return missingdocs;
      };
      var staff=$scope.staff;

      $scope.genders = genders;

      $scope.departments= ah_departments;

      $scope.employeetypes= ah_employeetypes;
      $scope.maritalstatuses=maritalstatuses;

      $scope.religions=religions;

      $scope.ahcountries = ahcountries;

      $scope.countries = world_countries;
      $scope.documentType=documentType;
      //pull these from a database or API -
      //BUG WARNING: if value doesn't match index in array things will get wonky

     $scope.setfilter = function() {
       $scope.search = {};
       $scope.search[ $scope.searchoption.key ] = $scope.searchoption.filter;
     };

     $scope.setfilterEmployeeReport = function() {
       $scope.searchEmployeeReport = {};
       $scope.searchEmployeeReport[ $scope.searchoptionEmployeeReport.key ] = $scope.searchoptionEmployeeReport.filter;
     };
     $scope.generateYears = function(startYear){
       var years = [];
       var currentYear = new Date().getFullYear();
       for (var i = 0; i <= currentYear-startYear ; i++){
           years.push(currentYear-i);
       }
       return years;
     };
     //-----------------------
     $scope.filterEmployee = function(){
       // reset form
       $("#searchKey").val("");
       $("#searchValue").val("");
       // reset search result
       $scope.search = {};
       $scope.orderInactiveEmployee="";
       $scope.curInactiveEmployees = [];
       if($scope.years.selectedYear==null){
         $scope.curInactiveEmployees = $scope.inactiveEmployees;
       }
       else{
         for(var i = 0; i < $scope.inactiveEmployees.length;i++){
           var year = new Date($scope.inactiveEmployees[i].enddate).getFullYear();
           if($scope.years.selectedYear==year){
             $scope.curInactiveEmployees.push($scope.inactiveEmployees[i]);
           }
         }
       }
     };
     $scope.filterEmployeeReport = function(){
       $scope.employeesReport = [];
       if($scope.years.selectedYearEmployeeReport==null){
         $scope.employeesReport = $scope.employees;
       }
       else{
         for(var i = 0; i < $scope.employees.length;i++){
           var year = new Date($scope.employees[i].startdate).getFullYear();
           if($scope.years.selectedYearEmployeeReport==year){
             $scope.employeesReport.push($scope.employees[i]);
           }
         }
       }
     };
     $scope.filterEmployeeByDateRange = function(startdate,endate){
       $scope.curInactiveEmployees = [];
       for(var i = 0; i < $scope.inactiveEmployees.length;i++){
         var year =$scope.inactiveEmployees[i].enddate;
         if(year>=startdate && year <= endate){
           $scope.curInactiveEmployees.push($scope.inactiveEmployees[i]);
         }
       }
     };
     $scope.filterEmployeeReportByRangeStartDate = function(From,To){
       $scope.employeesReport = [];
       for(var i = 0; i < $scope.employees.length;i++){
         var year =$scope.employees[i].startdate;
         if(year>=From && year <= To){
           $scope.employeesReport.push($scope.employees[i]);
         }
       }
     };
     $scope.exportData = function (tableID,fileName) {
      var $table = $('#'+tableID+'');
      var $rows = $table.find('tr:has(td),tr:has(th)');
           // Temporary delimiter characters unlikely to be typed by keyboard
           // This is to avoid accidentally splitting the actual contents
      var  tmpColDelim = String.fromCharCode(11); // vertical tab character
      var  tmpRowDelim = String.fromCharCode(0); // null character

           // actual delimiter characters for CSV format
      var colDelim = '","';
      var rowDelim = '"\r\n"';

           // Grab text from table into CSV formatted string
      var csv = '"' + $rows.map(function (i, row) {
               var $row = $(row);
              //  get th and td don't have class '.hideColumn'
               var $cols = $row.find('td:not(.hideColumn),th:not(.hideColumn)');

               return $cols.map(function (j, col) {
                 var $col = $(col);
                 var text = $col.text();

                 return text.replace(/"/g, '""'); // escape double quotes

               }).get().join(tmpColDelim);

           }).get().join(tmpRowDelim)
               .split(tmpRowDelim).join(rowDelim)
               .split(tmpColDelim).join(colDelim) + '"';

           // Data URI
          //  csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
        var blob = new Blob([csv], {
            type: "text/csv;charset=utf-8",
            encoding: 'utf-8'
        });
        // save to csv file
        saveAs(blob, fileName+".csv");
    };
    $scope.documentStatus = function (document,employeeCurrentDocument,country,religion){
      var document_status;
      if( ((document.value=="19" || document.value=="12" ) && country!="KH") || ((document.value=="10" || document.value=="11" || document.value=="13") && country=="KH") || ((document.value=="2") && religion!="Christian") ){
        document_status = "N/A";
      }
      else{
        if(employeeCurrentDocument!=undefined && employeeCurrentDocument.length>0){
          for(var i=0; i<employeeCurrentDocument.length; i++){
             if(document.value == employeeCurrentDocument[i]['DocumentID']){
               document_status= 'Yes';
                 break;
             }
             else {
               document_status= 'No';
             }
          }
        }
        else {
            document_status= 'No';
        }
      }
      return document_status;
    };
    $scope.resetEmployeeReport = function(){
      $("#searchoptionEmployeeReport").val("");
      $("#searchEmployeeReport").val("");
      $("#fromStartDate").val("");
      $("#toStartDate").val("");
      $("#selecedyearEmployeeReport").val("");
      $scope.searchEmployeeReport = {};
      $scope.employeesReport = $scope.employees;
    }
    $scope.resetInactiveStaffForm = function(){
      $("#searchKey").val("");
      $("#searchValue").val("");
      $("#selecedyear").val("");
      $("#startDate").val("");
      $("#endDate").val("");
      // reset search result
      $scope.search = {};
      $scope.curInactiveEmployees = $scope.inactiveEmployees;
    }
  });
}());
