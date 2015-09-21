describe('* Config route', function() {

  var $rootScope, $state, state = 'admin.staff';

  beforeEach(function() {

    module('employeeList');

    inject(function(_$rootScope_, _$state_,$templateCache) {
        $rootScope = _$rootScope_;
        $state = _$state_;
        $templateCache.put('templates/admin.html', '');
      })
    });
    describe('test state',function(){
      describe('/ state', function() {
        it('should uses the right url', function() {
          state = $state.get('/');
          expect(state.url).toBe('/');
        });
        it('should uses the right template', function() {
          state = $state.get('/');
          expect(state.templateUrl).toBe('templates/simpleuser.html');
        });
      });
      describe('admin state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin');
          expect(state.url).toBe('/admin');
        });
        it('should uses the right template', function() {
          state = $state.get('admin');
          expect(state.templateUrl).toBe('templates/admin.html');
        });
      });
      describe('admin.staff state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.staff');
          expect(state.url).toBe('/staff/:instanceID');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.staff');
          expect(state.templateUrl).toBe('templates/view.html');
        });
        it('should uses the right controller', function() {
          state = $state.get('admin.staff');
          expect(state.controller).toBe('CuremployeeCtrl');
        });
      });
      describe('admin.profile state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.profile');
          expect(state.url).toBe('/profile/');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.profile');
          expect(state.templateUrl).toBe('templates/viewSelf.html');
        });
      });
      describe('admin.profile state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.register');
          expect(state.url).toBe('/register/');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.register');
          expect(state.templateUrl).toBe('templates/register.html');
        });
      });
      describe('admin.reports state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.reports');
          expect(state.url).toBe('/reports/');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.reports');
          expect(state.templateUrl).toBe('templates/reports.html');
        });
      });
      describe('admin.groups state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.groups');
          expect(state.url).toBe('/groups/');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.groups');
          expect(state.templateUrl).toBe('templates/groups.html');
        });
      });
      describe('admin.MissingInfo state', function() {
        it('should uses the right url', function() {
          state = $state.get('admin.MissingInfo');
          expect(state.url).toBe('/MissingInfo/');
        });
        it('should uses the right template', function() {
          state = $state.get('admin.MissingInfo');
          expect(state.templateUrl).toBe('templates/missing_info_report.html');
        });
      });
    });
});
