describe('* storageService', function() {

  beforeEach(module('employeeList'));

  var storageService;
  beforeEach(inject(function(_storageService_) {
    storageService = _storageService_;
  }));
  it ('should have get() function', function() {
      expect(storageService.get).toBeDefined();
  });
  it ('should have save() function', function() {
      expect(storageService.save).toBeDefined();
  });
  it ('should have remove() function', function() {
      expect(storageService.remove).toBeDefined();
  });
  it ('should have clearAll() function', function() {
      expect(storageService.clearAll).toBeDefined();
  });
  describe('test function called',function(){
    it ('should return localStorage data affter calling get() function', function() {
      var key = 'users';
      localStorage.removeItem(key);
      localStorage.setItem(key,JSON.stringify({"name":"test_name"}));
      expect(storageService.get(key)).toEqual(localStorage.getItem(key));
    });
    it('should set data in local storage after calling save() function', function() {
      var user = { name: 'test', id: 1 };
      storageService.save('employees',user);
      var localUser = JSON.parse(localStorage.getItem('employees'));
      expect(localUser).toEqual(user);
    });
    it('should remove employees from  local storage after calling remove() function', function() {
      var user = { name: 'test', id: 1 };
      var key = 'employees';
      localStorage.setItem(key,user);
      storageService.remove(key);
      expect(localStorage.getItem(key)).toEqual(null);
    });
    it('should clear all local storage after calling clearAll() function', function() {
      localStorage.setItem('test','data');
      storageService.clearAll();
      expect(localStorage.getItem('test')).toEqual(null);
    });
  });


});
