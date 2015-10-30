var app =  angular.module('employeeList',['datatables','datatables.tabletools','xeditable','ui.router','Service','ngOptionsDisabled']);
(function () {
   'use strict';
   app.run(function(editableOptions,$rootScope, $state, $location, $timeout){
        editableOptions.theme='bs3';
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
            else{
              $rootScope.title = "Asian Hope Employee Management System";
            }
        });

    });
})();
