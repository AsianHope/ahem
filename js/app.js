var app =  angular.module('employeeList',['datatables','datatables.tabletools','xeditable','ui.router','Service','ngOptionsDisabled']);
(function () {
   'use strict';
   app.run(function(editableOptions,$rootScope, $state, $location, $timeout){
         $rootScope.$on('$viewContentLoaded', function(){
              $timeout(function(){
                componentHandler.upgradeAllRegistered();
              })
            })

         editableOptions.theme='bs3';
         var routeCount = 0;
         $rootScope.$on('$stateChangeStart', function (e,toState) {
           $rootScope.current_url = $location.absUrl();
           routeCount+=1

           var url_for_admin = '/admin'
           var current_url = $location.url()
           var is_request_to_admin = current_url.startsWith(url_for_admin)

           if (is_request_to_admin==true && $rootScope.user.isAdmin==false && routeCount > 1){
             $rootScope.permission_denied = true;
             $rootScope.user.uname = null;
             $rootScope.user.pw = null;
             $rootScope.user.isAdmin==false;
             sessionStorage.removeItem('user');
           }

         })
        $rootScope.$on('$stateChangeSuccess', function(event, toState){
            $rootScope.$state = $state;
            $rootScope.showInclude = false;
            if($state.current.name === 'admin.staff') {
                $rootScope.showInclude = true;
                $rootScope.title = "View Employee";
            }
            else if($state.current.name === 'admin.profile') {
                $rootScope.showInclude = true;
                $rootScope.title = "Profile";
            }
            else if($state.current.name === 'admin.reports') {
                $rootScope.showInclude = true;
                $rootScope.title = "Expat Staff Report";
            }
            else if($state.current.name === 'admin.register') {
                $rootScope.showInclude = true;
                $rootScope.title = "Register";
            }
            else if($state.current.name === 'admin.MissingInfo') {
                $rootScope.showInclude = true;
                $rootScope.title = "Missing Information Report";
            }
            else if($state.current.name === 'admin.groups') {
                $rootScope.showInclude = true;
                $rootScope.title = "Groups";
            }
            else if($state.current.name === 'admin.inactiveStaffReport') {
                $rootScope.showInclude = true;
                $rootScope.title = "Inactive Staff Report";
            }
            else if($state.current.name === 'admin.documentReport') {
                $rootScope.showInclude = true;
                $rootScope.title = "Document Report";
            }
            else if($state.current.name === 'admin.employeeReport') {
                $rootScope.showInclude = true;
                $rootScope.title = "Employee Report";
            }
            else if($state.current.name === 'admin.approveRequestAccount') {
                $rootScope.showInclude = true;
                $rootScope.title = "Approve Request Account";
            }
            else if($state.current.name === 'admin.emergencySMS') {
                $rootScope.showInclude = true;
                $rootScope.title = "Emergency SMS";
            }
            else{
              $rootScope.title = "Asian Hope Employee Management System";
            }
        });

    });
})();
