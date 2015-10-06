describe('* EmployeeListController', function() {
  beforeEach(angular.mock.module('employeeList'));

  var EmployeeListController,LoginController;
  var $scope,$location,$http,$httpBackend,$window,$q;
  var EmployeesService,storageService;
  var deferred;
  // Mock services and spy on method
  beforeEach(inject(function($q, _EmployeesService_) {
    deferred = $q.defer();
    EmployeesService = _EmployeesService_;
    spyOn(EmployeesService, 'getEmployees').and.returnValue(deferred.promise);
    spyOn(EmployeesService,'updateEmployees').and.returnValue(deferred.promise);
    spyOn(EmployeesService,'resetPassword').and.returnValue(deferred.promise);;
  }));

  // Initialize the controller and a mock scope.
  beforeEach(inject(function ($rootScope, $controller,$templateCache,_$window_,_$httpBackend_,_$location_,_$http_,_EmployeesService_, _storageService_) {
    $scope = $rootScope.$new();
    $http = _$http_;
    $location = _$location_;
    $httpBackend = _$httpBackend_;
    EmployeesService = _EmployeesService_;
    storageService = _storageService_;
    $window = _$window_;
    spyOn($window,'alert');
    $templateCache.put('templates/simpleuser.html', '');
    createController = function(params) {
      return $controller("EmployeeListController", {
        $scope: $scope,
        EmployeesService: EmployeesService
      });
    };
    LoginController = $controller('LoginController', {
      $scope: $scope
    });
    EmployeeListController = $controller('EmployeeListController', {
      $scope : $scope,
      EmployeesService:EmployeesService
    });
  }));
      it("should call geEmployees in EmployeesService", function() {
        createController();
        expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'CURSTAFF');
      });
      it('if Server error should set username and password to null',function(){
        // deferred.resolve(data); // Resolve the promise.
        createController();
        deferred.reject(400); // Reject the promise.
        $scope.$digest();
        expect($scope.user.uname).toBe(null);
        expect($scope.user.pw).toBe(null);
        expect($scope.loading).toBe(false);
      });
      it('if result error should set username and password to null',function(){
        var data= {"data":{result:"error"},"status":200};
        deferred.resolve(data); // Resolve the promise.
        createController();
        $scope.$digest();
        expect($scope.user.uname).toBe(null);
        expect($scope.user.pw).toBe(null);
        expect($scope.loading).toBe(false);
      });
      describe('test get data success',function(){
        it('should set employees',function(){
          var employees;
          $scope.user.uname='nsweet';
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "employeeNumber":"1000",
                "uid":"nsweet",
                "cn": "nsweet"
                },
                {
                "uidNumber":"1000822",
                "departmentNumber":"LIS",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                "cn": "ssang"
                }
            ],
            "status":200};
          deferred.resolve(data); // Resolve the promise.
          createController();
          $scope.$digest();
          employees = data.data;
          expect($scope.employees).toBe(employees);
          expect($scope.loading).toBe(false);
        });
        describe('test current employee match',function(){
          it('should set $scope.selfselect if curemployee match',function(){
            var employees;
            $scope.user.uname='nsweet';
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "employeeNumber":"1000",
                  "uid":"nsweet",
                  "cn": "nsweet"
                  },
                  {
                  "uidNumber":"1000822",
                  "departmentNumber":"LIS",
                  "employeeNumber":"1000822",
                  "employeeType":"PT",
                  "cn": "ssang"
                  }
              ],
              "status":200};
            deferred.resolve(data); // Resolve the promise.
            createController();
            $scope.$digest();
            employees = data.data;
            var curemployee;
            for (var i = 0; i < employees.length; i++) {
              if(employees[i].cn.localeCompare($scope.user.uname) == 0){
                curemployee = employees[i];
                break;
              }
            }
            expect($scope.selfselect).not.toBe(null);
            expect($scope.selfselect).toEqual(curemployee);
          });
          describe('test style color',function(){
            it('should set style color to blue (#488FCC) if departmentNumber is LIS',function(){
              var spy = spyOn($.fn,'css');
              var employees;
              $scope.user.uname='nsweet';
              var data= {"data":
                [
                    {
                    "departmentNumber":"LIS",
                    "displayName":"nsweet",
                    "employeeNumber":"1000",
                    "uid":"nsweet",
                    "cn": "nsweet"
                    }
                ],
                "status":200};
              deferred.resolve(data); // Resolve the promise.
              createController();
              $scope.$digest();
              expect(spy).toHaveBeenCalledWith('border', '1px solid #488FCC');
              expect(spy).toHaveBeenCalledWith('color', '#488FCC');
              expect(spy).toHaveBeenCalledWith('background-color', '#488FCC');
              expect($scope.style_anchor()).toEqual({color: "#488FCC"});
            });
            it('should set style color to green (#26AF5F) if departmentNumber is AHIS',function(){
              var spy = spyOn($.fn,'css');
              var employees;
              $scope.user.uname='nsweet';
              var data= {"data":
                [
                    {
                    "departmentNumber":"AHIS",
                    "displayName":"nsweet",
                    "employeeNumber":"1000",
                    "uid":"nsweet",
                    "cn": "nsweet"
                    }
                ],
                "status":200};
              deferred.resolve(data); // Resolve the promise.
              createController();
              $scope.$digest();
              expect(spy).toHaveBeenCalledWith('border', '1px solid #26AF5F');
              expect(spy).toHaveBeenCalledWith('color', '#26AF5F');
              expect(spy).toHaveBeenCalledWith('background-color', '#26AF5F');
              expect($scope.style_anchor()).toEqual({color: "#26AF5F"});
            });
          });
        });
      });
      describe('test initialize scope varible',function(){
        it('should have $scope.showlist to be false',function(){
          expect($scope.showlist).toBeDefined();
          expect($scope.showlist).toBe(false);
        });
        it('should have $scope.loading to be true',function(){
          expect($scope.loading).toBeDefined();
          expect($scope.loading).toBe(true);
        });
        it('should have $scope.curemployee to be null',function(){
          expect($scope.curemployee).toBeDefined();
          expect($scope.curemployee).toBe(null);

        });
        it('should have $scope.employees to be empty array',function(){
          expect($scope.employees).toBeDefined();
          expect($scope.employees).toBeArray();
          expect($scope.employees).toBeEmptyArray();
        });
        it('should have $scope.local_data to be array',function(){
          expect($scope.local_data).toBeDefined();
          expect($scope.local_data).toBeArray();
        });
        it('should have $scope.current_pass to be null',function(){
          expect($scope.current_pass).toBeDefined();
          expect($scope.current_pass).toBe(null);
        });
        it('should have $scope.password length to be 8',function(){
          expect($scope.password).toBeDefined();
          expect($scope.password.length).toBe(8);
        });
        it('$scope.keylist should equal abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&', function (){
          expect($scope.keylist).toEqual('abcdefghijklmnopqrstuvwxyz123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$*&');
        });
        it('$scope.plength should equal 8', function (){
          expect($scope.plength).toEqual(8);
        });
        it('should have $scope.groups to be empty array',function(){
          expect($scope.groups).toBeDefined();
          expect($scope.groups).toBeArray();
          expect($scope.groups).toBeEmptyArray();
        });
        it('should have $scope.curGroups to be empty array',function(){
          expect($scope.curGroups).toBeDefined();
          expect($scope.curGroups).toBeArray();
          expect($scope.curGroups).toBeEmptyArray();
        });
        it('should have $scope.modifyGroupSms to be empty array',function(){
          expect($scope.modifyGroupSms).toBeDefined();
          expect($scope.modifyGroupSms).toBe(null);
        });
        it('should set $scope.genders =  genders',function(){
          expect($scope.genders).toBeDefined();
          expect($scope.genders).toEqual(genders);
        });
        it('should set $scope.departments = ah_departments',function(){
          expect($scope.departments).toBeDefined();
          expect($scope.departments).toEqual(ah_departments);
        });
        it('should set $scope.employeetypes = ah_employeetypes',function(){
          expect($scope.employeetypes).toBeDefined();
          expect($scope.employeetypes).toEqual(ah_employeetypes);
        });
        it('should set $scope.maritalstatuses = maritalstatuses',function(){
          expect($scope.maritalstatuses).toBeDefined();
          expect($scope.maritalstatuses).toEqual(maritalstatuses);
        });
        it('should set  $scope.religions = religions',function(){
          expect($scope.religions).toBeDefined();
          expect($scope.religions).toEqual(religions);
        });
        it('should set $scope.ahcountries = ahcountries',function(){
          expect($scope.ahcountries).toBeDefined();
          expect($scope.ahcountries).toEqual(ahcountries);
        });
        it('should set $scope.countries = world_countries',function(){
          expect($scope.countries).toBeDefined();
          expect($scope.countries).toEqual(world_countries);
        });
        it('should set $scope.documentType = documentType',function(){
          expect($scope.documentType).toBeDefined();
          expect($scope.documentType).toEqual(documentType);
        });
      });
    describe('test function defined',function(){
      it('Should have a keyPress() function', function() {
        expect($scope.keyPress).toBeDefined();
      });
      it('Should have a keyPressBack() function', function() {
        expect($scope.keyPressBack).toBeDefined();
      });
      it('Should have a keyclickshide() function', function() {
        expect($scope.keyclickshide).toBeDefined();
      });
      it('Should have a clearform() function', function() {
        expect($scope.clearform).toBeDefined();
      });
      it('Should have a checkStorage() function', function() {
        expect($scope.checkStorage).toBeDefined();
      });
      it('Should have a tempPassword() function', function() {
        expect($scope.tempPassword).toBeDefined();
      });
      it('Should have a range() function', function() {
        expect($scope.range).toBeDefined();
      });
      it('Should have a setEmployee() function', function() {
        expect($scope.setEmployee).toBeDefined();
      });
      it('Should have a refreshEmployeeData() function', function() {
        expect($scope.refreshEmployeeData).toBeDefined();
      });
      it('Should have a showRequestedAccounts() function', function() {
        expect($scope.showRequestedAccounts).toBeDefined();
      });
      it('Should have a showDisabledAccounts() function', function() {
        expect($scope.showDisabledAccounts).toBeDefined();
      });
      it('Should have a showInactiveAccounts() function', function() {
        expect($scope.showInactiveAccounts).toBeDefined();
      });
      it('Should have a showGroup() function', function() {
        expect($scope.showGroup).toBeDefined();
      });
      it('Should have a showAllGroups() function', function() {
        expect($scope.showAllGroups).toBeDefined();
      });
      it('Should have a timeBetween() function', function() {
        expect(EmployeeListController.timeBetween).toBeDefined();
      });
      it('Should have a duration() function', function() {
        expect($scope.duration).toBeDefined();
      });
      it('Should have a selectSelf() function', function() {
        expect(EmployeeListController.selectSelf).toBeDefined();
      });
      it('Should have a updateUser() function', function() {
        expect($scope.updateUser).toBeDefined();
      });
      it('Should have a removeUserFromGroup() function', function() {
        expect($scope.removeUserFromGroup).toBeDefined();
      });
      it('Should have a addUserToGroup() function', function() {
        expect($scope.addUserToGroup).toBeDefined();
      });
      it('Should have a resetPassword() function', function() {
        expect($scope.resetPassword).toBeDefined();
      });
      it('Should have a decodeAppleBirthday() function', function() {
        expect($scope.decodeAppleBirthday).toBeDefined();
      });
      it('Should have a showMissingDocs() function', function() {
        expect($scope.showMissingDocs).toBeDefined();
      });
      describe('test showMissingDocs() return value',function(){
        it('should return all required documents when documentList is undefined ', function() {
          var documentList= undefined;
          var other_doc = undefined;
          // documentType get from constants.js
          expect($scope.showMissingDocs(documentList,other_doc,documentType)).toEqual(documentType);
        });
        it('should return some required documents when documentList is defined ', function() {
          var doclist= [
            {"data":"files/1001051/1001051-ssang-Child Protection Policy.jpg","$$hashKey":"012","Description":"Child Protection Policy","DocumentID":"4"},
            {"data":"files/1001051/1001051-ssang-Photo.jpg","$$hashKey":"012","Description":"Photo","DocumentID":"0"}
          ]
          var other_doc= [
            {"data":"files/1001051/1001051-ssang-Other Document-test.jpg","Description":"test","DocumentID":"1"}
          ]
          // documentType get from constants.js
          var required_docs = documentType;
          var tempid;
          var reqdocs = required_docs.slice();
          var missingdocs=[];
          //get rid of all docs they have
          for(var i=0; i<doclist.length; i++){
            tempid=doclist[i].DocumentID;
            delete reqdocs['16'];
            delete reqdocs[tempid];
          }
          for(var i=0; i<required_docs.length; i++){
            if(reqdocs[i]) missingdocs.push(reqdocs[i]);
          }
          expect($scope.showMissingDocs(doclist,other_doc,required_docs)).toEqual(missingdocs);
        });
      });

    });
    describe('test function called',function(){
      it('should change $scope.showlist from false to true when keyPress() is called', function (){
        expect($scope.showlist).toEqual(false);
        $scope.keyPress();
        expect($scope.showlist).toEqual(true);
      });
      it('should change url location to /admin when keyPressBack() is called', function (){
        spyOn($location, 'path');
        $scope.keyPressBack();
        expect($location.path).toHaveBeenCalledWith('/admin');
      });
      it('should change $scope.showlist to flase when keyclickshide() is called', function (){
        $scope.keyclickshide();
        expect($scope.showlist).toEqual(false);
      });
      describe('when tempPassword() function is called',function(){
        it('should return random password length equal 8', function (){
          expect($scope.password.length).toEqual(8)
        });
      })
      describe('when range() function is called',function(){
        it('should return  5 Array when pass 5', function (){
          expect($scope.range(5)).toEqual(new Array(parseInt(5)));
        });
      });
      describe('when setEmployee function is called',function(){
        it('Should set $scope.curemployee = setEmployee', function (){
          var setEmployee ={"firstName":"John", "lastName":"Doe"};
          $scope.setEmployee(setEmployee);
          expect($scope.curemployee).toEqual(setEmployee);
        });
      });
      describe('when refreshEmployeeData function is called',function(){
        it("should set $scope.loading to true", function() {
          $scope.refreshEmployeeData();
          expect($scope.loading).toBe(true);
        });
        it("should set $scope.employees to empty array", function() {
          $scope.refreshEmployeeData();
          expect($scope.employees.length).toBe(0);
        });
        it("should call getEmployees() with scope `ALL`", function() {
          $scope.refreshEmployeeData();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'ALL');
        });
        it('if get data success should set employees',function(){
          var data= {"data":{name:"solida"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          createController();
          $scope.$digest();
          expect($scope.employees).toBe(data.data);
          // finaly callback
          // called no matter success or failure
          expect($scope.loading).toBe(false);
        });
      });
      describe('when showRequestedAccounts function is called',function(){
        it("should set $scope.loading to true", function() {
          $scope.showRequestedAccounts();
          expect($scope.loading).toBe(true);
        });
        it("should set $scope.employees to empty array", function() {
          $scope.showRequestedAccounts();
          expect($scope.employees.length).toBe(0);
        });
        it("should call getEmployees() with scope `REQUESTS`", function() {
          $scope.showRequestedAccounts();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'REQUESTS');
        });
        it('if get data success should set employees',function(){
          var data= {"data":{name:"solida"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          createController();
          $scope.$digest();
          expect($scope.employees).toBe(data.data);
          // finaly callback
          // called no matter success or failure
          expect($scope.loading).toBe(false);
        });
      });
      describe('when showDisabledAccounts function is called',function(){
        it("should set $scope.loading to true", function() {
          $scope.showDisabledAccounts();
          expect($scope.loading).toBe(true);
        });
        it("should set $scope.employees to empty array", function() {
          $scope.showDisabledAccounts();
          expect($scope.employees.length).toBe(0);
        });
        it("should call getEmployees() with scope `DISABLED`", function() {
          $scope.showDisabledAccounts();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'DISABLED');
        });
        it('if get data success should set employees',function(){
          var data= {"data":{name:"solida"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          createController();
          $scope.$digest();
          expect($scope.employees).toBe(data.data);
          // finaly callback
          // called no matter success or failure
          expect($scope.loading).toBe(false);
        });
      });
      describe('when showInactiveAccounts function is called',function(){
        it("should set $scope.loading to true", function() {
          $scope.showInactiveAccounts();
          expect($scope.loading).toBe(true);
        });
        it("should set $scope.employees to empty array", function() {
          $scope.showInactiveAccounts();
          expect($scope.employees.length).toBe(0);
        });
        it("should call getEmployees() with scope `INACTIVE`", function() {
          $scope.showInactiveAccounts();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'INACTIVE');
        });
        it('if get data success should set employees',function(){
          var data= {"data":{name:"solida"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          createController();
          $scope.$digest();
          expect($scope.employees).toBe(data.data);
          // finaly callback
          // called no matter success or failure
          expect($scope.loading).toBe(false);
        });
      });
      describe('when decodeAppleBirthday function is called',function(){
        var birthday = '19960929070000Z';
        describe('with `birthday` equal null',function(){
          var birthday = '19960929070000Z';
          it("should return `DOB`", function() {
            $scope.decodeAppleBirthday(null);
            expect($scope.decodeAppleBirthday(null)).toEqual('DOB');
          });
        });
        describe('with `birthday` not null',function(){
          var applebirthday = '19960929070000Z';
          it("should return correct birthday format", function() {
            $scope.decodeAppleBirthday(applebirthday);
            applebirthday=applebirthday.replace(/-/g,'')
            var year = applebirthday.substr(0,4)
            var month = applebirthday.substr(4,2)
            var day = applebirthday.substr(6,2)
            var birthday= year+'-'+month+'-'+day
            expect($scope.decodeAppleBirthday(applebirthday)).toEqual(birthday);
          });
        });
      });
      describe('when timeBetween function is called',function(){
        describe('with `startDate` equal null',function(){
            it('Should return message',function(){
              var startDate = null;
              var endDate = 'present';
                expect(EmployeeListController.timeBetween(startDate,endDate)).toEqual('Please enter a start date');

            });
        });
        describe('with `startDate` not null',function(){

            it('Should calculate time by endDate - startDate if have actual endDate',function(){
              var startDate = '2013-08-01';
              var endDate = '2015-05-29';
              var start = new Date(startDate);
              var end = new Date(endDate);
              var diff = (end - start);

              //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
              var day = 1000 * 60 * 60 * 24;

              var years = Math.floor(diff/(365*day));
              if (years>=1) diff -= 365*years*day;

              var months = Math.floor(diff/(31*day));
              if(months>=1) diff-=31*months*day;

              var days= Math.floor(diff/day);

              var time= 'approximately '+years+' year(s), '+months+' month(s), '+days+' day(s)';
              expect(EmployeeListController.timeBetween(startDate,endDate)).toEqual(time);
            });
            it('Should calculate time by endDate - NOW if endDate equal present',function(){
              var startDate = '2013-08-01';
              var endDate = 'present';
              if (endDate === 'present') endDate=new Date();
              var start = new Date(startDate);
              var end = new Date(endDate);
              var diff = (end - start);

              //1000ms/s * 60s/min * 60m/hr * 24
              var day = 1000 * 60 * 60 * 24;

              var years = Math.floor(diff/(365*day));
              if (years>=1) diff -= 365*years*day;

              var months = Math.floor(diff/(31*day));
              if(months>=1) diff-=31*months*day;

              var days= Math.floor(diff/day);

              var time= 'approximately '+years+' year(s), '+months+' month(s), '+days+' day(s)';
              expect(EmployeeListController.timeBetween(startDate,'present')).toEqual(time);
            });

        });
      });
      //duration
      describe('when duration function is called',function(){
            it('Should calculate time by endDate - startDate if have actual endDate',function(){
              var startDate = '2013-08-01';
              var endDate = '2015-05-29';

              var start = new Date(startDate);
              var end = new Date(endDate);
              var diff = (end - start);

              //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
              var day = 1000 * 60 * 60 * 24;

              var years = Math.floor(diff/(365*day));
              if (years>=1) diff -= 365*years*day;

              var months = Math.floor(diff/(31*day));
              if(months>=1) diff-=31*months*day;

              var days= Math.floor(diff/day);

              var time= years+' year(s), '+months+' month(s)';
              expect($scope.duration(startDate,endDate)).toEqual(time);
            });
            it('Should calculate time by endDate - NOW if endDate equal present',function(){
              var startDate = '2013-08-01';
              var endDate = 'present';
              if (endDate === 'present') endDate=new Date();
              var start = new Date(startDate);
              var end = new Date(endDate);
              var diff = (end - start);

              //1000ms/s * 60s/min * 60m/hr * 24 hrs/day
              var day = 1000 * 60 * 60 * 24;

              var years = Math.floor(diff/(365*day));
              if (years>=1) diff -= 365*years*day;

              var months = Math.floor(diff/(31*day));
              if(months>=1) diff-=31*months*day;

              var days= Math.floor(diff/day);

              var time= years+' year(s), '+months+' month(s)';
              expect($scope.duration(startDate,'present')).toEqual(time);
            });
      });
      describe('when showGroup() function is called',function(){
        it('$scope.curGroups should be empty',function(){
          $scope.showGroup();
          expect($scope.curGroups.length).toBe(0);
        });
        it('$scope.loading should be true',function(){
          $scope.showGroup();
          expect($scope.loading).toBe(true);
        });
        it('should called getEmployees() with scope `GROUPS`',function(){
          $scope.showGroup();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'GROUPS');
        });
        describe('test get groups success',function(){
          it('should set $scope.groups',function(){
            var data= {"data":{group:"staff"},"status":200};
            deferred.resolve(data); // Resolve the promise.
            $scope.showGroup();
            $scope.$digest();
            expect($scope.groups).toBe(data.data);
            expect($scope.loading).toBe(false);
          });
          it('should set $scope.curGroups if group is match employee',function(){
            var data= {"data":
              [
                {"mail":"testtest@asianhope.org",
                "memberUid":["lyle","nsweet","ssang"],
                "displayName":"test group",
                "cn":"testgroup",
                "description":"test group"
                },
                {"mail":"test@asianhope.org",
                "memberUid":["lyle","nsweet"],
                "displayName":"test",
                "cn":"test",
                "description":"test"
                }
              ],
              "status":200};
              var groups = data.data;
              var group = [];
              var uid = 'ssang';
              deferred.resolve(data); // Resolve the promise.
              $scope.showGroup(uid);
              $scope.$digest();
              for(var i=0; i<groups.length; i++){
                if(groups[i]['memberUid']!= undefined){
                  for(var j=0;j<groups[i]['memberUid'].length;j++){
                    if(groups[i]['memberUid'][j]==uid){
                      group.push(groups[i]);
                    }
                  }
                }
              }
              expect($scope.curGroups).not.toBe(null);
              expect($scope.curGroups).toEqual(group);
          });
        });

      });
      describe('when showAllGroups() function is called',function(){
        it('$scope.loading should be true',function(){
          $scope.showAllGroups();
          expect($scope.loading).toBe(true);
        });
        it('should called getEmployees() with scope `GROUPS`',function(){
          $scope.showGroup();
          expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'GROUPS');
        });
        it('if get data success should set $scope.groups',function(){
          var data= {"data":{group:"staff"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          $scope.showGroup();
          $scope.$digest();
          expect($scope.groups).toBe(data.data);
          expect($scope.loading).toBe(false);
        });
      });
      describe('when updateUser() function is called',function(){
        it('should called updateEmployees() with cn `users`',function(){
          var uid = '123';
          var field = 'name';
          var data = 'NAME';
          var cn = 'users';
          var modifyType='null';
          $scope.updateUser(uid,field,data);
          expect(EmployeesService.updateEmployees).toHaveBeenCalledWith(uid,field,data,$scope.user.uname,$scope.user.pw,cn,modifyType);
        });
      });
      describe('when removeUserFromGroup() function is called',function(){
        it('should called updateEmployees() with cn `GROUPS`',function(){
          var uid = '123';
          var field = 'name';
          var data = 'NAME';
          var cn = 'groups';
          var modifyType='remove';
          $scope.removeUserFromGroup(uid,field,data);
          expect(EmployeesService.updateEmployees).toHaveBeenCalledWith(uid,field,data,$scope.user.uname,$scope.user.pw,cn,modifyType);
        });
        it('if result return `success` should set $scope.modifyGroupSms',function(){
          var data= {"data":{result:"success"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          $scope.removeUserFromGroup();
          $scope.$digest();
          expect($scope.modifyGroupSms).toEqual('Remove employee from group success!');
        });
        it('if result return `no_such_attribute` should set $scope.modifyGroupSms',function(){
          var data= {"data":{result:"no_such_attribute"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          $scope.removeUserFromGroup();
          $scope.$digest();
          expect($scope.modifyGroupSms).toEqual("Remove employee Fail! Don't have this emplyee in group.");
        });
        it('if result return `error` should set $scope.modifyGroupSms',function(){
          var data= {"data":{result:"error"},"status":200};
          deferred.resolve(data); // Resolve the promise.
          $scope.removeUserFromGroup();
          $scope.$digest();
          expect($scope.modifyGroupSms).toEqual('Fail to remove employee from group!');
        });
        it('if server error should set $scope.modifyGroupSms',function(){
          deferred.reject(400); // Reject the promise.
          $scope.removeUserFromGroup();
          $scope.$digest();
          expect($scope.modifyGroupSms).toEqual('Server error!');
        });
      });
      describe('when addUserToGroup() function is called',function(){
        describe('test function called with field null',function(){
          it('should set $scope.modifyGroupSms to `Please choose group!`',function(){
            var uid = '123';
            var field = null;
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            $scope.addUserToGroup(uid,field,data);
            expect($scope.modifyGroupSms).toEqual('Please choose group!');
          });
        });
        describe('test function called with field not null',function(){
          it('should called updateEmployees() with cn `GROUPS` and modifyType `add`',function(){
            var uid = '123';
            var field = 'GROUP_NAME';
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            $scope.addUserToGroup(uid,field,data);
            expect(EmployeesService.updateEmployees).toHaveBeenCalledWith(uid,field,data,$scope.user.uname,$scope.user.pw,cn,modifyType);
          });
          it('if result return `success` should set $scope.modifyGroupSms',function(){
            var uid = '123';
            var field = 'GROUP_NAME';
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            var data= {"data":{result:"success"},"status":200};
            deferred.resolve(data); // Resolve the promise.
            $scope.addUserToGroup(uid,field,data);
            $scope.$digest();
            expect($scope.modifyGroupSms).toEqual('Add employee to group success!');
          });
          it('if result return `value_exists` should set $scope.modifyGroupSms',function(){
            var uid = '123';
            var field = 'GROUP_NAME';
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            var data= {"data":{result:"value_exists"},"status":200};
            deferred.resolve(data); // Resolve the promise.
            $scope.addUserToGroup(uid,field,data);
            $scope.$digest();
            expect($scope.modifyGroupSms).toEqual('Emplyee already exist in this group!');
          });
          it('if result return `error` should set $scope.modifyGroupSms',function(){
            var uid = '123';
            var field = 'GROUP_NAME';
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            var data= {"data":{result:"error"},"status":200};
            deferred.resolve(data); // Resolve the promise.
            $scope.addUserToGroup(uid,field,data);
            $scope.$digest();
            expect($scope.modifyGroupSms).toEqual('Fail to add employee to group!');
          });
          it('if server error should set $scope.modifyGroupSms',function(){
            var uid = '123';
            var field = 'GROUP_NAME';
            var data = '123';
            var cn = 'groups';
            var modifyType='add';
            var data= {"data":{result:"error"},"status":200};
            deferred.reject(400); // Reject the promise.
            $scope.addUserToGroup(uid,field,data);
            $scope.$digest();
            expect($scope.modifyGroupSms).toEqual('Server error!');
          });
        });
      });
      describe('when resetPassword() function is called',function(){
        describe('test function called with confirm password  does not match',function(){
          it('should alert message',function(){
            var uid = '123';
            var type = 'admin_reset';
            var data = '1234';
            var confirmpass='12345';
            $scope.resetPassword(uid,data,type,confirmpass);
            expect($window.alert).toHaveBeenCalledWith('Your current passwords do not match.');
          });
        });
        describe('test function called with confirm password match',function(){
          it('should called resetPassword()',function(){
            var uid = '123';
            var type = 'admin_reset';
            var data = '1234';
            var confirmpass=null;
            $scope.resetPassword(uid,data,type,confirmpass);
            expect(EmployeesService.resetPassword).toHaveBeenCalledWith(uid,data,$scope.user.uname,$scope.user.pw,type);
          });
          describe('test return result success',function(){
            it('should alert success message and back to login page when reset type is youreset',function(){
              var resolveData= {"data":{result:"success"},"status":200};
              var uid = '123';
              var type = 'youreset';
              var data = '1234';
              var confirmpass=null;

              deferred.resolve(resolveData); // Resolve the promise.
              $scope.resetPassword(uid,data,type,confirmpass);
              $scope.$digest();
              expect($window.alert).toHaveBeenCalledWith('Your password has been reset! Plase login again.');
              expect($scope.user.uname).toBe(null);
              expect($scope.user.pw).toBe(null);
            });
            it('if result return `success` should  alert success message when reset type is admin_reset',function(){
              var resolveData= {"data":{result:"success"},"status":200};
              var uid = '123';
              var type = 'admin_reset';
              var data = '1234';
              var confirmpass=null;

              deferred.resolve(resolveData); // Resolve the promise.
              $scope.resetPassword(uid,data,type,confirmpass);
              $scope.$digest();
              expect($window.alert).toHaveBeenCalledWith('Password has been reset!');
              expect($scope.current_pass).toEqual("");
            });
          });
          it('if result return `error` should alert error message',function(){
            var resolveData= {"data":{result:"error"},"status":200};
            var uid = '123';
            var type = 'admin_reset';
            var data = '1234';
            var confirmpass=null;

            deferred.resolve(resolveData); // Resolve the promise.
            $scope.resetPassword(uid,data,type,confirmpass);
            $scope.$digest();
            expect($window.alert).toHaveBeenCalledWith("You don't have permission to update.");
          });
          it('if server error should alert error message',function(){
            var uid = '123';
            var type = 'admin_reset';
            var data = '1234';
            var confirmpass=null;

            deferred.reject(400);
            $scope.resetPassword(uid,data,type,confirmpass);
            $scope.$digest();
            expect($window.alert).toHaveBeenCalledWith("Server error!");
          });
        });
      });
    });

});
