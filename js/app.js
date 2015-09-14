var app =  angular.module('employeeList',['xeditable','ui.router','Service']);
(function () {
   'use strict';
   app.run(function(editableOptions,$rootScope, $state, $location, $timeout){
        editableOptions.theme='bs3';
        $rootScope.$on('$stateChangeSuccess', function(event, toState){
            $rootScope.$state = $state;
            $rootScope.showInclude = false;
            if($state.current.name === 'admin.staff') {
                $rootScope.showInclude = true;
            }
            else if($state.current.name === 'admin.profile') {
                $rootScope.showInclude = true;
            }
            else if($state.current.name === 'admin.reports') {
                $rootScope.showInclude = true;
            }
            else if($state.current.name === 'admin.register') {
                $rootScope.showInclude = true;
            }
            else if($state.current.name === 'admin.MissingInfo') {
                $rootScope.showInclude = true;
            }
            else if($state.current.name === 'admin.groups') {
                $rootScope.showInclude = true;
            }
        });

    });
})();
