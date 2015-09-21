describe('* EmployeeRegistrationController', function() {
  beforeEach(angular.mock.module('employeeList'));

  var EmployeeRegistrationController;
  var $scope;
  var EmployeesService;
  var deferred;
  var formdata = {
     'employeeType':'FT',
     'l':'KH',
     'c':'US',
     'apple-birthday':'1970-01-01',
     'departmentNumber':'UNK'
  };

  // Initialize the controller and a mock scope.
  beforeEach(inject(function ($rootScope, $controller,_EmployeesService_,$q) {
    $scope = $rootScope.$new();
    EmployeesService = _EmployeesService_;
    deferred = $q.defer();
    spyOn(EmployeesService, 'addEmployee').and.returnValue(deferred.promise);

    EmployeeRegistrationController = $controller('EmployeeRegistrationController', {
      $scope :  $scope,
      EmployeesService:EmployeesService
    });
      spyOn($scope,'tempPasswordRegister');
  }));

  describe('test variables initialization',function(){
    it('should have $scope.password length to be 8',function(){
      expect($scope.password).toBeDefined();
      expect($scope.password.length).toBe(8);
    });
    it('should set $scope.countries = world_countries',function(){
      expect($scope.countries).toBeDefined();
      expect($scope.countries).toEqual(world_countries);
    });
    it('should set   $scope.departments = ah_departments',function(){
      expect($scope.departments).toBeDefined();
      expect($scope.departments).toEqual(ah_departments);
    });
    it('should set keylistRe equal abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&',function(){
      expect($scope.keylistRe).toBeDefined();
      expect($scope.keylistRe).toEqual('abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&');
    });
    it('should set plengthRe equal 8',function(){
      expect($scope.plengthRe).toBeDefined();
      expect($scope.plengthRe).toEqual(8);
    });
    it('$scope.formdata object should be defined',function(){
      expect($scope.formdata).toBeDefined();
      expect($scope.formdata).toEqual(formdata);
    });
  });
  describe('test function defined',function(){
    it('tempPassword should be defined',function(){
      expect($scope.tempPasswordRegister).toBeDefined();
    });
    it('registerAccount should be defined',function(){
      expect($scope.registerAccount).toBeDefined();
    });
    it('resetRequestForm should be defined',function(){
      expect($scope.resetRequestForm).toBeDefined();
    });
  });
  describe('test function called',function(){
    describe('when tempPassword function is called',function(){
      it('should generate password length equal 8', function (){
        $scope.tempPasswordRegister();
        expect($scope.password.length).toEqual(8);
      });
    });
    describe('when resetRequestForm function is called',function(){
      it('success_message should be null', function (){
        $scope.resetRequestForm();
        expect($scope.success_message).toBeDefined();
        expect($scope.success_message).toEqual(null);
      });
      it("$scope.formdata should be {'l':'KH'}", function (){
        $scope.resetRequestForm();
        expect($scope.formdata).toEqual({'l':'KH'});
      });
      it("should called tempPassword function", function (){
        $scope.resetRequestForm();
        expect($scope.tempPasswordRegister).toHaveBeenCalled();
      });
    });
    describe('when registerAccount function is called',function(){
      it("formdata.userPassword should be defined ", function (){
        $scope.registerAccount();
        expect($scope.formdata.userPassword).toBeDefined();
      });
      it('should called addEmployee() from EmployeesServiceservice',function(){
        $scope.registerAccount();
        formdata['userPassword']=$scope.password;
        expect(EmployeesService.addEmployee).toHaveBeenCalledWith(formdata);
      });
      it('if get data success should set $scope.success_message',function(){
        var data= {"data":{result:"success"},"status":200};
        deferred.resolve(data); // Resolve the promise.
        formdata['userPassword']=$scope.password;
        $scope.registerAccount();
        $scope.$digest();
        expect($scope.success_message).toEqual('Success!');
      });
    });
  });

});
