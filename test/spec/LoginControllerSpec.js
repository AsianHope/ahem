describe('* LoginController', function() {
  beforeEach(angular.mock.module('employeeList'));

  var LoginController;
  var scope;
  // Initialize the controller and a mock scope.

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    $rootscope = $rootScope;

    LoginController = $controller('LoginController', {
      $scope: $scope
    });
    spyOn(componentHandler, 'upgradeAllRegistered');
  }));
    describe('Affter login() is called', function() {
      it('username and password should not null',function(){
        $scope.login();
        expect($scope.user.uname).not.toEqual(null);
        expect($scope.user.pw).not.toEqual(null);
      });
      it('should call componentHandler.upgradeAllRegistered() function',function(){
        $scope.login();
        $scope.$digest();
        $rootscope.$broadcast('$viewContentLoaded');
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
      });
    });
});
