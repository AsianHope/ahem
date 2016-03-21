(function () {
    'use strict';
          //password match
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
          //validate phone number format
          app.directive('validPhoneNumberFormat', [function () {
            return {
                restrict: 'A',
                scope:true,
                require: 'ngModel',
                link: function (scope, elem , attrs,control) {
                    var checker = function () {
                        //get the value
                        var e2 = scope.$eval(attrs.validPhoneNumberFormat);
                        if(e2 == undefined || e2 == null || e2 == ''){
                          return true;
                        }
                        else{
                          return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(e2);
                        }
                    };
                    scope.$watch(checker, function (n) {
                        control.$setValidity("validFormat", n);
                    });
                }
            };
          }]);
          // validate input type file
          app.directive('validFile',function(){
            return {
              require:'ngModel',
              link:function(scope,el,attrs,ngModel){
                //change event is fired when file is selected
                el.bind('change',function(){
                  scope.$apply(function(){
                    ngModel.$setViewValue(el.val());
                    ngModel.$render();
                  })
                })
              }
            }
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

}());
