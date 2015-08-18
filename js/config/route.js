(function () {
    'use strict';
    // app.config(['$routeProvider',
    // function($routeProvider) {
    // $routeProvider.
    //   when('/', {
    //     templateUrl: 'templates/simpleuser.html'
    //   }).
    //   when('/admin', {
    //     templateUrl: 'templates/admin.html'
    //   }).
    //   when('/admin/staff/:id', {
    //     templateUrl: 'templates/ViewStaffProfile.html',
    //     controller:'EmployeeListController'
    //   }).
    //   otherwise({
    //     templateUrl: 'templates/simpleuser.html'
    //   });
    // }]);


    app.config(function($stateProvider, $urlRouterProvider){

      // For any unmatched url, send to /route1
      $urlRouterProvider.otherwise("/")

      $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "templates/simpleuser.html"
        })
        .state('admin', {
            url: "/admin",
            templateUrl: "templates/admin.html"
        })
        .state('admin.staff', {
          url: '/staff/:instanceID',
          controller:'CuremployeeCtrl',
          templateUrl: "templates/view.html"
        })
        .state('admin.profile', {
          url: '/profile/',
          templateUrl: "templates/viewSelf.html"
        })
        .state('admin.register', {
          url: '/register/',
          templateUrl: "templates/register.html"
        })
        .state('admin.reports', {
          url: '/reports/',
          templateUrl: "templates/reports.html"
        })
        .state('admin.groups', {
          url: '/groups/',
          templateUrl: "templates/groups.html"
        })
        .state('admin.MissingInfo', {
          url: '/MissingInfo/',
          templateUrl: "templates/missing_info_report.html"
        });

    });

}());
