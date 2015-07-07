(function(){
    var app = angular.module('employeelist', ['xeditable','ngRoute']);

    //  password match
    app.directive('passwordMatch', [function () {
      return {
          restrict: 'A',
          scope:true,
          require: 'ngModel',
          link: function (scope, elem , attrs,control) {
              var checker = function () {

                  //get the value of the first password
                  var e1 = scope.$eval(attrs.ngModel);

                  //get the value of the other password
                  var e2 = scope.$eval(attrs.passwordMatch);
                  return e1 == e2;
              };
              scope.$watch(checker, function (n) {

                  //set the form control to valid if both
                  //passwords are the same, else invalid
                  control.$setValidity("unique", n);
              });
          }
      };
    }]);
    app.config(['$routeProvider',
    function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/simpleuser.html'
      }).
      when('/admin', {
        templateUrl: 'templates/admin.html'
      }).
      otherwise({
        templateUrl: 'templates/simpleuser.html'
      });
    }]);

    app.run(function(editableOptions){
            editableOptions.theme='bs3';
    });

    app.directive('resetPassword', function(){
  	return {
  		restrict: 'E',
  		templateUrl: 'templates/resetpassword.html',
  	};
    });
    app.directive('staffList', function(){
  	return {
  		restrict: 'E',
  		templateUrl: 'templates/stafflist.html',
  	};
    });
    app.directive('newStaff', function(){
  	return {
  		restrict: 'E',
  		templateUrl: 'templates/register.html',
  	};
    });

    app.directive('viewStaff', function(){
  	return {
  		restrict: 'E',
  		templateUrl: 'templates/view.html',
  	};
    });

    //---------------
    app.directive('viewSelf', function(){
      return {
        restrict: 'E',
        templateUrl: 'templates/viewSelf.html',
      };
    });

    app.directive('stafflistSimpleuser', function(){
      return {
        restrict: 'E',
        templateUrl: 'templates/stafflistSimpleuser.html',
      };
    });
    //---------------

   app.directive('ahemlog', function(){
    	return {
    		restrict: 'E',
    		templateUrl: 'templates/ahem-log.html',
    	};
    });
    app.directive('staffStatus', function(){
      return {
        restrict: 'E',
        templateUrl: 'templates/status.html',
      };
    });
    app.directive('reports', function(){
      return {
        restrict: 'E',
        templateUrl: 'templates/reports.html',
      };
    });
   app.controller('TabController', function(){
        this.tab=3;
        this.isSet = function(checkTab){
            return this.tab === checkTab;
        };

        this.setTab = function(setTab){
            this.tab = setTab;
        };
    });

   app.controller('LoginController', function($scope, $http){

     $scope.user = {
       uname: null,
       pw: null
     }

     $scope.login = function () {
          $scope.user.uname = $scope.username;
          $scope.user.pw = $scope.password;
     };

   });

   app.controller('EmployeeListController', function($scope, $http, $filter, $q){
        $scope.email;
        $scope.current_pass;
        $scope.password;
        $scope.password = password;
        var keylist="abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&";
        var temp='';
        var plength=8;
         // taken from http://www.javascriptkit.com/script/script2/passwordgenerate.shtml
         $scope.tempPassword = function(){
             temp='';
             for (i=0;i<plength;i++)
               temp+=keylist.charAt(Math.floor(Math.random()*keylist.length));
             $scope.password = temp;
         };
         $scope.tempPassword();

          var data = {
                username: $scope.user.uname,
                pw: $scope.user.pw,
                scope:'CURSTAFF'
                }
          var uri = encodeURI('cgi-bin/dump.cgi');
          $http({
                  method  : 'POST',
                  url     : uri,
                  data    : $.param(data),  // pass in data as strings
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                }).success(function(data, status, headers, config) {
                       if(data.result== 'error'){
                         //pop us back out to the login screen
                         $scope.user.uname = null;
                         $scope.user.pw = null;
                       }
                       else{
                         $scope.employees = data;
                         }
                  }).error(function(data, status, headers, config){
                       $scope.user.uname = null;
                       $scope.user.pw = null;
                  });

            $scope.range = function(n) {
               n.trim();
              return new Array(parseInt(n));
            };
          //no one selected initially
          this.curemployee=null;

          //begin internal functions
          this.refreshEmployeeData = function(){
            $scope.employees = [];
            this.curemployee=null;
              var data = {
                    username: $scope.user.uname,
                      pw: $scope.user.pw,
                      scope:'CURSTAFF'
                  }
              var uri = encodeURI('cgi-bin/dump.cgi');
              $http({
                    method  : 'POST',
                    url     : uri,
                    data    : $.param(data),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                   }).success(function(data, status, headers, config) {
                     $scope.employees = data;
                   });
          };

          this.showRequestedAccounts = function(){
            $scope.employees = [];
            this.curemployee=null;
            var data = {
                  username: $scope.user.uname,
                    pw: $scope.user.pw,
                    scope:'CURSTAFF'
                }
            var uri = encodeURI('cgi-bin/dump.cgi');
            $http({
                  method  : 'POST',
                  url     : uri,
                  data    : $.param(data),  // pass in data as strings
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                 }).success(function(data, status, headers, config) {
                   $scope.employees = data;
                   })
            };

          this.showDisabledAccounts = function(){
            $scope.employees = [];
            this.curemployee=null;
            var data = {
                  username: $scope.user.uname,
                    pw: $scope.user.pw,
                    scope:'CURSTAFF'
                }
            var uri = encodeURI('cgi-bin/dump.cgi');
            $http({
                  method  : 'POST',
                  url     : uri,
                  data    : $.param(data),  // pass in data as strings
                  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                 }).success(function(data, status, headers, config) {
                   $scope.employees = data;
                   })
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
        this.clearEmployee = function(){
            this.curemployee=null;
        };
        this.setEmployee = function(setEmployee){
            this.curemployee=setEmployee;
        };

      	this.selectSelf = function(){
                  for(var i=0; i<$scope.employees.length; i++){
      		if($scope.employees[i].cn.localeCompare($scope.user.uname) == 0){
            this.selfselect=$scope.employees[i];
      		   break;

      		}
      	    }
      	};

        this.shift = function(amount){
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber === this.curemployee.employeeNumber){
                    this.curemployee = $scope.employees[i+amount];
                    break;
                }
            }
        };
        $scope.updateUser = function(uid, field, data){
                var d = $q.defer();
                var encoded_data = encodeURIComponent(data);
                var data = {
                    uid: uid,
                    field: field,
                    data:encoded_data,
                    username:$scope.user.uname,
                    pw:$scope.user.pw
                    }
                var uri = encodeURI('cgi-bin/update.cgi');
                $http({
                      method  : 'POST',
                      url     : uri,
                      data    : $.param(data),  // pass in data as strings
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data, status, headers, config){
                         if(data.result== 'success'){
                             d.resolve()
                         }
                         else
                             d.resolve("There was an error");
                       }).
                       error(function(data, status, headers, config){
                             d.reject('Server error!');
                     });
                     return d.promise;
        }

        $scope.resetPassword = function(uid,data,type,confirmpass){
                var d = $q.defer();
                var encoded_data = encodeURIComponent(data);
                var data = {
                    uid: uid,
                    field: "userPassword",
                    data:encoded_data,
                    username:$scope.user.uname,
                    pw:$scope.user.pw,
                    reset_type:type
                    }
                var uri = encodeURI('cgi-bin/update.cgi');
                if(confirmpass==$scope.user.pw){
                  $http({
                        method  : 'POST',
                        url     : uri,
                        data    : $.param(data),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                      }).success(function(data, status, headers, config){
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

              year = applebirthday.substr(0,4)
              month = applebirthday.substr(4,2)
              day = applebirthday.substr(6,2)
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


   app.controller('EmployeeRegistrationController', function($scope, $http, $q){
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
          for (i=0;i<plength;i++)
            temp+=keylist.charAt(Math.floor(Math.random()*keylist.length));
          $scope.password = temp;
      };

      $scope.tempPassword();


      $scope.registerAccount = function(){
              var d = $q.defer();
              $scope.formdata['userPassword']=$scope.password;
              var uri = encodeURI('cgi-bin/register.cgi');
              $http({
                    method  : 'POST',
                    url     : uri,
                    data    : $.param($scope.formdata),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                   }).
                success(function(data, status, headers, config){
                  if(data.result== 'success'){
                      $scope.success_message = "Success!";
                      d.resolve()
                  }
                  else
                      d.resolve("There was an error");
                }).
                error(function(data, status, headers, config){
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
//globals
    var ah_employeetypes = [
        {value: 'PT', text: 'Part Time'},
        {value: 'FT', text: 'Full Time'},
        {value: 'NLE', text: 'No Longer Employed'},
        {value: 'DUP', text: 'Duplicate Entry'}
    ];

    var ah_departments = [
        {value: 'ADMIN-KH', text: 'Admin Cambodia'},
        {value: 'ADMIN-USA', text: 'Admin USA'},
        {value: 'AHIS', text: 'Asian Hope School'},
        {value: 'TTP', text: 'Teacher Training Program'},
        {value: 'HELP', text: 'HELP'},
        {value: 'LIS', text: 'Logos'},
        {value: 'MIS', text: 'MIS Department'},
        {value: 'VDP-G', text: 'VDP General'},
        {value: 'VDP-TK', text: 'VDP Toul Kork'},
        {value: 'VDP-PPT', text: 'VDP Phnom Penh Thmey'},
        {value: 'VDP-PKP', text: 'VDP Prek Pneu'},
        {value: 'VDP-NKO', text: 'VDP NKO'},
        {value: 'MULTI', text: 'Multiple Departments'},
        {value: 'UNK', text: 'Unknown Department'},

    ];

    var world_countries = [
      {value: 'AF', text: 'Afghanistan'},
      {value: 'AX', text: '�land Islands'},
      {value: 'AL', text: 'Albania'},
      {value: 'DZ', text: 'Algeria'},
      {value: 'AS', text: 'American Samoa'},
      {value: 'AD', text: 'Andorra'},
      {value: 'AO', text: 'Angola'},
      {value: 'AI', text: 'Anguilla'},
      {value: 'AG', text: 'Antigua and Barbuda'},
      {value: 'AR', text: 'Argentina'},
      {value: 'AM', text: 'Armenia'},
      {value: 'AW', text: 'Aruba'},
      {value: 'AU', text: 'Australia'},
      {value: 'AT', text: 'Austria'},
      {value: 'AZ', text: 'Azerbaijan'},
      {value: 'BS', text: 'Bahamas'},
      {value: 'BH', text: 'Bahrain'},
      {value: 'BD', text: 'Bangladesh'},
      {value: 'BB', text: 'Barbados'},
      {value: 'BY', text: 'Belarus'},
      {value: 'BE', text: 'Belgium'},
      {value: 'BZ', text: 'Belize'},
      {value: 'BJ', text: 'Benin'},
      {value: 'BM', text: 'Bermuda'},
      {value: 'BT', text: 'Bhutan'},
      {value: 'BO', text: 'Bolivia' },
      {value: 'BQ', text: 'Bonaire'},
      {value: 'BA', text: 'Bosnia and Herzegovina'},
      {value: 'BW', text: 'Botswana'},
      {value: 'BV', text: 'Bouvet Island'},
      {value: 'BR', text: 'Brazil'},
      {value: 'IO', text: 'British Indian Ocean Territory'},
      {value: 'BN', text: 'Brunei Darussalam'},
      {value: 'BG', text: 'Bulgaria'},
      {value: 'BF', text: 'Burkina Faso'},
      {value: 'BI', text: 'Burundi'},
      {value: 'CV', text: 'Cabo Verde'},
      {value: 'KH', text: 'Cambodia'},
      {value: 'CM', text: 'Cameroon'},
      {value: 'CA', text: 'Canada'},
      {value: 'KY', text: 'Cayman Islands'},
      {value: 'CF', text: 'Central African Republic'},
      {value: 'TD', text: 'Chad'},
      {value: 'CL', text: 'Chile'},
      {value: 'CN', text: 'China'},
      {value: 'CX', text: 'Christmas Island'},
      {value: 'CC', text: 'Cocos (Keeling) Islands'},
      {value: 'CO', text: 'Colombia'},
      {value: 'KM', text: 'Comoros'},
      {value: 'CG', text: 'Congo'},
      {value: 'CD', text: 'Congo'},
      {value: 'CK', text: 'Cook Islands'},
      {value: 'CR', text: 'Costa Rica'},
      {value: 'CI', text: 'C�te d\'Ivoire'},
      {value: 'HR', text: 'Croatia'},
      {value: 'CU', text: 'Cuba'},
      {value: 'CW', text: 'Cura�ao'},
      {value: 'CY', text: 'Cyprus'},
      {value: 'CZ', text: 'Czech Republic'},
      {value: 'DK', text: 'Denmark'},
      {value: 'DJ', text: 'Djibouti'},
      {value: 'DM', text: 'Dominica'},
      {value: 'DO', text: 'Dominican Republic'},
      {value: 'EC', text: 'Ecuador'},
      {value: 'EG', text: 'Egypt'},
      {value: 'SV', text: 'El Salvador'},
      {value: 'GQ', text: 'Equatorial Guinea'},
      {value: 'ER', text: 'Eritrea'},
      {value: 'EE', text: 'Estonia'},
      {value: 'ET', text: 'Ethiopia'},
      {value: 'FO', text: 'Faroe Islands'},
      {value: 'FJ', text: 'Fiji'},
      {value: 'FI', text: 'Finland'},
      {value: 'FR', text: 'France'},
      {value: 'GF', text: 'French Guiana'},
      {value: 'PF', text: 'French Polynesia'},
      {value: 'GA', text: 'Gabon'},
      {value: 'GM', text: 'Gambia'},
      {value: 'GE', text: 'Georgia'},
      {value: 'DE', text: 'Germany'},
      {value: 'GH', text: 'Ghana'},
      {value: 'GI', text: 'Gibraltar'},
      {value: 'GR', text: 'Greece'},
      {value: 'GL', text: 'Greenland'},
      {value: 'GD', text: 'Grenada'},
      {value: 'GP', text: 'Guadeloupe'},
      {value: 'GU', text: 'Guam'},
      {value: 'GT', text: 'Guatemala'},
      {value: 'GG', text: 'Guernsey'},
      {value: 'GN', text: 'Guinea'},
      {value: 'GW', text: 'Guinea-Bissau'},
      {value: 'GY', text: 'Guyana'},
      {value: 'HT', text: 'Haiti'},
      {value: 'HN', text: 'Honduras'},
      {value: 'HK', text: 'Hong Kong'},
      {value: 'HU', text: 'Hungary'},
      {value: 'IS', text: 'Iceland'},
      {value: 'IN', text: 'India'},
      {value: 'ID', text: 'Indonesia'},
      {value: 'IR', text: 'Iran'},
      {value: 'IQ', text: 'Iraq'},
      {value: 'IE', text: 'Ireland'},
      {value: 'IM', text: 'Isle of Man'},
      {value: 'IL', text: 'Israel'},
      {value: 'IT', text: 'Italy'},
      {value: 'JM', text: 'Jamaica'},
      {value: 'JP', text: 'Japan'},
      {value: 'JE', text: 'Jersey'},
      {value: 'JO', text: 'Jordan'},
      {value: 'KZ', text: 'Kazakhstan'},
      {value: 'KE', text: 'Kenya'},
      {value: 'KI', text: 'Kiribati'},
      {value: 'KP', text: 'North Korea'},
      {value: 'KR', text: 'Korea'},
      {value: 'KW', text: 'Kuwait'},
      {value: 'KG', text: 'Kyrgyzstan'},
      {value: 'LA', text: 'Laos'},
      {value: 'LV', text: 'Latvia'},
      {value: 'LB', text: 'Lebanon'},
      {value: 'LS', text: 'Lesotho'},
      {value: 'LR', text: 'Liberia'},
      {value: 'LY', text: 'Libya'},
      {value: 'LI', text: 'Liechtenstein'},
      {value: 'LT', text: 'Lithuania'},
      {value: 'LU', text: 'Luxembourg'},
      {value: 'MO', text: 'Macao'},
      {value: 'MK', text: 'Macedonia'},
      {value: 'MG', text: 'Madagascar'},
      {value: 'MW', text: 'Malawi'},
      {value: 'MY', text: 'Malaysia'},
      {value: 'MV', text: 'Maldives'},
      {value: 'ML', text: 'Mali'},
      {value: 'MT', text: 'Malta'},
      {value: 'MH', text: 'Marshall Islands'},
      {value: 'MQ', text: 'Martinique'},
      {value: 'MR', text: 'Mauritania'},
      {value: 'MU', text: 'Mauritius'},
      {value: 'YT', text: 'Mayotte'},
      {value: 'MX', text: 'Mexico'},
      {value: 'FM', text: 'Micronesia'},
      {value: 'MD', text: 'Moldova'},
      {value: 'MC', text: 'Monaco'},
      {value: 'MN', text: 'Mongolia'},
      {value: 'ME', text: 'Montenegro'},
      {value: 'MS', text: 'Montserrat'},
      {value: 'MA', text: 'Morocco'},
      {value: 'MZ', text: 'Mozambique'},
      {value: 'MM', text: 'Myanmar'},
      {value: 'NA', text: 'Namibia'},
      {value: 'NR', text: 'Nauru'},
      {value: 'NP', text: 'Nepal'},
      {value: 'NL', text: 'Netherlands'},
      {value: 'NC', text: 'New Caledonia'},
      {value: 'NZ', text: 'New Zealand'},
      {value: 'NI', text: 'Nicaragua'},
      {value: 'NE', text: 'Niger'},
      {value: 'NG', text: 'Nigeria'},
      {value: 'NU', text: 'Niue'},
      {value: 'NO', text: 'Norway'},
      {value: 'OM', text: 'Oman'},
      {value: 'PK', text: 'Pakistan'},
      {value: 'PW', text: 'Palau'},
      {value: 'PS', text: 'Palestine'},
      {value: 'PA', text: 'Panama'},
      {value: 'PG', text: 'Papua New Guinea'},
      {value: 'PY', text: 'Paraguay'},
      {value: 'PE', text: 'Peru'},
      {value: 'PH', text: 'Philippines'},
      {value: 'PN', text: 'Pitcairn'},
      {value: 'PL', text: 'Poland'},
      {value: 'PT', text: 'Portugal'},
      {value: 'PR', text: 'Puerto Rico'},
      {value: 'QA', text: 'Qatar'},
      {value: 'RE', text: 'R�union'},
      {value: 'RO', text: 'Romania'},
      {value: 'RU', text: 'Russian Federation'},
      {value: 'RW', text: 'Rwanda'},
      {value: 'BL', text: 'Saint Barth�lemy'},
      {value: 'SH', text: 'Saint Helena'},
      {value: 'WS', text: 'Samoa'},
      {value: 'SM', text: 'San Marino'},
      {value: 'ST', text: 'Sao Tome and Principe'},
      {value: 'SA', text: 'Saudi Arabia'},
      {value: 'SN', text: 'Senegal'},
      {value: 'RS', text: 'Serbia'},
      {value: 'SC', text: 'Seychelles'},
      {value: 'SL', text: 'Sierra Leone'},
      {value: 'SG', text: 'Singapore'},
      {value: 'SK', text: 'Slovakia'},
      {value: 'SI', text: 'Slovenia'},
      {value: 'SB', text: 'Solomon Islands'},
      {value: 'SO', text: 'Somalia'},
      {value: 'ZA', text: 'South Africa'},
      {value: 'SS', text: 'South Sudan'},
      {value: 'ES', text: 'Spain'},
      {value: 'LK', text: 'Sri Lanka'},
      {value: 'SD', text: 'Sudan'},
      {value: 'SR', text: 'Suriname'},
      {value: 'SZ', text: 'Swaziland'},
      {value: 'SE', text: 'Sweden'},
      {value: 'CH', text: 'Switzerland'},
      {value: 'TW', text: 'Taiwan'},
      {value: 'TJ', text: 'Tajikistan'},
      {value: 'TZ', text: 'Tanzania'},
      {value: 'TH', text: 'Thailand'},
      {value: 'TL', text: 'Timor-Leste'},
      {value: 'TG', text: 'Togo'},
      {value: 'TK', text: 'Tokelau'},
      {value: 'TO', text: 'Tonga'},
      {value: 'TT', text: 'Trinidad and Tobago'},
      {value: 'TN', text: 'Tunisia'},
      {value: 'TR', text: 'Turkey'},
      {value: 'TM', text: 'Turkmenistan'},
      {value: 'TV', text: 'Tuvalu'},
      {value: 'UG', text: 'Uganda'},
      {value: 'UA', text: 'Ukraine'},
      {value: 'AE', text: 'United Arab Emirates'},
      {value: 'GB', text: 'United Kingdom'},
      {value: 'US', text: 'United States'},
      {value: 'UY', text: 'Uruguay'},
      {value: 'UZ', text: 'Uzbekistan'},
      {value: 'VU', text: 'Vanuatu'},
      {value: 'VE', text: 'Venezuela'},
      {value: 'VN', text: 'Viet Nam'},
      {value: 'EH', text: 'Western Sahara'},
      {value: 'YE', text: 'Yemen'},
      {value: 'ZM', text: 'Zambia'},
      {value: 'ZW', text: 'Zimbabwe'},
    ];


})();
