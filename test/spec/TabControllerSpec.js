describe('* TabController', function() {
  beforeEach(module('employeeList'));
  var TabController,$scope;

  beforeEach(inject(function ($rootScope, $controller) {
    $scope = $rootScope.$new();
    TabController = $controller('TabController', {
      $scope: $scope
    });
  }));
    it('should set tab equal 3 ', function() {
      expect(TabController.tab).toBeDefined();
      expect(TabController.tab).toEqual(3);
    });
    it('should isSet() function ', function() {
      expect(TabController.isSet).toBeDefined();
    });
    it('should setTab() function ', function() {
      expect(TabController.setTab).toBeDefined();
    });
    describe('test function called',function(){
      describe('setTab() function is called', function() {
        it('should set tab  equal to argument of isSet() function',function(){
          var test = 6;
          TabController.setTab(test);
          expect(TabController.tab).toEqual(test);
        });
      });
      describe('isSet() function called', function() {
        it('should return true if tab equal isSet() argument',function(){
          TabController.setTab(7);
          expect(TabController.isSet(7)).toBe(true);
        });
        it('should return false if tab not equal isSet() argument',function(){
          TabController.setTab(8);
          expect(TabController.isSet(7)).toBe(false);
        });
      });
    });

});
