(function () {
   'use strict';
  var app =  angular.module('employeeList', ['xeditable','ngRoute']);
       app.run(function(editableOptions){
               editableOptions.theme='bs3';
       });
})();
