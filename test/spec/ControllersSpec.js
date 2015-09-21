describe('Mock Controllers', function() {
  beforeEach(angular.mock.module('employeeList'));
  beforeEach(angular.mock.module('xeditable'));
  beforeEach(angular.mock.module('ui.router'));

  var LoginController,CuremployeeController;
  var EmployeeListController,EmployeeRegistrationController;
  var $scope,$http,$filter,$q,$location,$stateParams;
  var EmployeesService,storageService;
  var $controller;
  var spyPromise, deferred,mockMyService;
  beforeEach(inject(function ($rootScope, $controller,_$http_,_$filter_,_$q_,_$location_,_$stateParams_,_EmployeesService_,_storageService_) {
    $scope = $rootScope.$new();
    $location = _$location_;
    $http =_$http_;
    $filter =  _$filter_;
    $q = _$q_,
    $location = _$location_;
    $controller = $controller;

    EmployeesService = _EmployeesService_;
    storageService = _storageService_;

    deferred = _$q_.defer();
    spyPromise = deferred.promise;

    // login controller
    LoginController = $controller('LoginController', {
      $scope: $scope
    });

    // EmployeeListController
    EmployeeListController = $controller('EmployeeListController', {
      $scope : $scope,
      $http : $http,
      $filter : $filter,
      $q : $q,
      $location : $location,
      EmployeesService: EmployeesService,
      storageService : storageService,
    });


    EmployeeRegistrationController = $controller('EmployeeRegistrationController',{
      $scope : $scope,
      $http :$http,
      $q : $q,
      EmployeesService : EmployeesService
    });
    CuremployeeController = $controller('CuremployeeCtrl',{
      $scope : $scope,
      http :$http,
      stateParams : $stateParams,
      q : $q,
      EmployeesService : EmployeesService
    });
  }));
  it('should have LoginController controller',function(){
    expect(LoginController).toBeDefined();
  });
  it('should have EmployeeListController controller',function(){
    expect(EmployeeListController).toBeDefined();
  });
  it('should have EmployeeRegistrationController controller',function(){
    expect(EmployeeRegistrationController).toBeDefined();
  });
  it('should have CuremployeeController controller',function(){
    expect(CuremployeeController).toBeDefined();
  });
});
