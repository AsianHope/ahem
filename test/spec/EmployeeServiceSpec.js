describe('* EmployeesService', function() {

  beforeEach(module('Service'));

  var EmployeesService;
  var $httpBackend;
  var get_results,update_result,reset_results,register_results;

  beforeEach(inject(function(_EmployeesService_, _$httpBackend_) {
    EmployeesService = _EmployeesService_;
    $httpBackend = _$httpBackend_;
  }));
  it ('should have getEmployees() function', function() {
      expect(EmployeesService.getEmployees).toBeDefined();
  });
  it ('should have updateEmployees() function', function() {
      expect(EmployeesService.updateEmployees).toBeDefined();
  });
  it ('should have resetPassword() function', function() {
      expect(EmployeesService.resetPassword).toBeDefined();
  });
  it ('should have addEmployee() function', function() {
      expect(EmployeesService.addEmployee).toBeDefined();
  });
  describe('when getEmployees is called', function() {
    beforeEach(function() {
      $httpBackend.expectPOST('cgi-bin/dump.cgi','username=admin&pw=123&scope=CURSTAFF')
      .respond("get data success");
      EmployeesService.getEmployees('admin','123','CURSTAFF').then(function(result) {
          get_results = result;
      });
      $httpBackend.flush();
    });
    it('should send  HTTP POST request and return results data', function() {
      expect(get_results.data).toBe('get data success');
    });
  });

  describe('when updateEmployees is called', function() {
    beforeEach(function() {
      $httpBackend.expectPOST('cgi-bin/update.cgi',
      'uid=1234567&field=name&data=test_name&username=admin&pw=123&cn=users&modifyType=null')
      .respond("update data success");
      // updateEmployees : function(uid,field,data,username,password,cn,modifyType) {
      EmployeesService.updateEmployees('1234567','name','test_name','admin','123','users','null')
      .then(function(result){
        update_result = result;
      });
      $httpBackend.flush();
    });
    it('should send  HTTP POST request and return results data', function() {

      expect(update_result.data).toBe('update data success');
    });
  });

  describe('when resetPassword is called', function() {
    beforeEach(function() {
      $httpBackend.expectPOST('cgi-bin/update.cgi',
         'uid=1234567&field=userPassword&data=1234&username=admin&pw=123&reset_type=admin_reset&cn=users&modifyType=null')
         .respond("reset Password data success");
        //  resetPassword : function(uid,data,username,password,type) {
      EmployeesService.resetPassword('1234567','1234','admin','123','admin_reset')
      .then(function(result){
        reset_results = result;
      });
      $httpBackend.flush();
    });
    it('should send  HTTP POST request and return results data', function() {
      expect(reset_results.data).toBe('reset Password data success');
    });
  });

  describe('when addEmployee is called', function() {
    beforeEach(function() {
      $httpBackend.expectPOST('cgi-bin/register.cgi')
         .respond("register data success");
      EmployeesService.addEmployee('formdata')
      .then(function(result){
        register_results = result;
      });
      $httpBackend.flush();
    });
    it('should send  HTTP POST request and return results data', function() {
      expect(register_results.data).toBe('register data success');
    });
  });





  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});
