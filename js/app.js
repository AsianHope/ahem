var app =  angular.module('employeeList',['xeditable','ngRoute']);
(function () {
   'use strict';
   app.run(function(editableOptions){
        editableOptions.theme='bs3';
    });
})();
