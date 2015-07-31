var app =  angular.module('employeeList',['xeditable','ui.router']);
(function () {
   'use strict';
   app.run(function(editableOptions,$rootScope, $state, $location, $timeout){
        editableOptions.theme='bs3';
        $rootScope.$on('$stateChangeSuccess', function(event, toState){
            $rootScope.showInclude = false;
            if($state.current.name === 'admin.staff') {
                $rootScope.showInclude = true;
            }
        });
    });
})();
