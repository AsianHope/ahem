(function () {
      'use strict';
      var app = angular.module('employeeList');
      app.controller('TabController',function () {
        this.tab=3;
        this.isSet = function(checkTab){
            return this.tab === checkTab;
        };
        this.setTab = function(setTab){
            this.tab = setTab;
        };
      });
  }());
