describe('* test run block ', function() {
  beforeEach(angular.mock.module('employeeList'));

  var editableOption;
  var scope,$state;
  // Initialize the controller and a mock scope.
  beforeEach(inject(function ($rootScope,editableOptions,_$state_,$templateCache) {
    $scope = $rootScope.$new();
    $rootscope = $rootScope;
    editableOption = editableOptions;
    $state = _$state_;

    $templateCache.put('templates/admin.html', '');
    $templateCache.put('templates/view.html', '');
    $templateCache.put('templates/viewSelf.html','');
    $templateCache.put('templates/reports.html','');
    $templateCache.put('templates/register.html','');
    $templateCache.put('templates/missing_info_report.html','');
    $templateCache.put('templates/groups.html','');

  }));
  it('xeditable theme shoud be bs3',function(){
    expect(editableOption.theme).toEqual('bs3');

  });
  describe('$stateChangeSuccess', function() {
       it('should set $rootScope.showInclude to false', function() {
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($scope.showInclude).toBeDefined();
           expect($scope.showInclude).toBe(false);
       });
       describe('when go to state  admin.staff',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.staff');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.staff');
           expect($scope.showInclude).toBe(true);
         });
       });
       describe('when go to state admin.profile',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.profile');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.profile');
           expect($scope.showInclude).toBe(true);
         });
       });
       describe('when go to state admin.reports',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.reports');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.reports');
           expect($scope.showInclude).toBe(true);
         });
       });
       describe('when go to state admin.register',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.register');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.register');
           expect($scope.showInclude).toBe(true);
         });
       });
       describe('when go to state admin.MissingInfo',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.MissingInfo');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.MissingInfo');
           expect($scope.showInclude).toBe(true);
         });
       });
       describe('when go to state admin.groups',function(){
         it('should set $rootScope.showInclude to true', function() {
           $state.go('admin.groups');
           $rootscope.$digest();
           $rootscope.$broadcast('$stateChangeSuccess');
           expect($state.current.name).toBe('admin.groups');
           expect($scope.showInclude).toBe(true);
         });
       });


   });
});
