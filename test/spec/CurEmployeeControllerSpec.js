describe('* CuremployeeCtrl', function() {
  beforeEach(angular.mock.module('employeeList'));
  beforeEach(angular.mock.module('xeditable'));
  beforeEach(angular.mock.module('ui.router'));

  var EmployeeListController,CuremployeeCtrl,LoginController;
  var $scope,$rootscope,$location,stateParams,$state,$httpBackend;
  var EmployeesService,$controller;
  var input,$window;
  var modalDialog;
  var $q,deferred
  // Initialize the controller and a mock scope.
  beforeEach(inject(function ($rootScope,$controller,$q,_$window_,_$state_,_$compile_,$templateCache,_$httpBackend_,_$location_,_$stateParams_,_EmployeesService_) {
    $scope = $rootScope.$new();
    $rootscope = $rootScope;
    $location = _$location_;
    stateParams = _$stateParams_;
    EmployeesService = _EmployeesService_;
    $httpBackend = _$httpBackend_;
    $controller = $controller;
    $state = _$state_;
    $window = _$window_;
    deferred = $q.defer()
    $state.go('admin.staff', { 'instanceID':1000 });
    $httpBackend.whenPOST('cgi-bin/dump.cgi').respond('');
    $templateCache.put('templates/admin.html', '');
    $templateCache.put('templates/view.html', '');
    //------------upload file------------------
    input = angular.element('<input type="file" id="file"  ng-model="filename" valid-file name="userUpload" required/>');
    var form = angular.element('<form id="formUpload"></form>');
    spyOn(document, 'getElementById').and.returnValue(input);
    var file = {
          name: "test.png",
          type: "image/png"
      };

    var fileList = {
          0: file,
          length: 1,
          item: function (index) { return file; }
      };
      input.files = fileList; // assign the mock files to the input element
    // spyOn(document, 'getElementById').and.returnValue(form);
    LoginController = $controller('LoginController', {
      $scope: $scope
    });
    EmployeeListController = $controller('EmployeeListController', {
      $scope : $scope,
      stateParams : stateParams,
      modalDialog: modalDialog
    });
    CuremployeeCtrl = $controller('CuremployeeCtrl', {
      $scope : $scope,
      stateParams : stateParams
    });
    createCuremployeeCtrl = function() {
      $controller('CuremployeeCtrl', {
        $scope : $scope,
        stateParams : stateParams,
        modalDialog: modalDialog
      });
    };

    spyOn(componentHandler, 'upgradeAllRegistered');
    spyOn($scope,"updateUser").and.returnValue(deferred.promise);
    spyOn(EmployeesService, 'getEmployees').and.returnValue(deferred.promise);
    spyOn(EmployeesService, 'uploadFile').and.returnValue(deferred.promise);
    spyOn($location,"path");
    spyOn($window,"alert");
  }));
  it('should call componentHandler.upgradeAllRegistered() function',function(){
    $rootscope.$broadcast('$viewContentLoaded');
    $scope.$digest();
    expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();

  });
  it('should set $scope.ID to stateParams.instanceID',function(){
    expect($scope.loading).toBeDefined();
    expect($scope.ID).toBe(stateParams.instanceID);
  });
  it('should have $scope.otherDoc to be an empty object',function(){
    expect($scope.otherDoc).toBeDefined();
    expect($scope.otherDoc).toBeObject();
    expect($scope.otherDoc).toBeEmptyObject();
  });
  it('should have $scope.loading to true',function(){
    expect($scope.loading).toBeDefined();
    expect($scope.loading).toBe(true);
  });
  it('should have $scope.show_photo to true',function(){
    expect($scope.show_photo).toBeDefined();
    expect($scope.show_photo).toBe(false);
  });
  it('should have $scope.family_data to be empty array',function(){
    expect($scope.family_data).toBeDefined();
    expect($scope.family_data).toBeArray();
    expect($scope.family_data).toBeEmptyArray();
  });
  it('should have $scope.document to be empty array',function(){
    expect($scope.document).toBeDefined();
    expect($scope.document).toBeArray();
    expect($scope.document).toBeEmptyArray();
  });
  it('should have $scope.other_documents to be empty array',function(){
    expect($scope.other_documents).toBeDefined();
    expect($scope.other_documents).toBeArray();
    expect($scope.other_documents).toBeEmptyArray();
  });
  it('should have $scope.upload_sms to be null',function(){
    expect($scope.upload_sms).toBeDefined();
    expect($scope.upload_sms).toBe(null);
  });
  describe('test employees is null',function(){
    it('should called getEmployees()',function(){
      createCuremployeeCtrl();
      expect(EmployeesService.getEmployees).toHaveBeenCalledWith($scope.user.uname,$scope.user.pw,'CURSTAFF');
    });
    it('if result return error should back to login page',function(){
      var data= {"data":{result:"error"},"status":200};
      deferred.resolve(data); // Resolve the promise.
      createCuremployeeCtrl();
      $scope.$digest();
      expect($scope.user.uname).toBe(null);
      expect($scope.user.pw).toBe(null);
    });
    it('if server error should go back to login page',function(){
      deferred.reject(400);
      createCuremployeeCtrl();
      $scope.$digest();
      expect($scope.user.uname).toBe(null);
      expect($scope.user.pw).toBe(null);
    });
    it('if get data success should set $scope.employees',function(){
      var data= {"data":{name:"solida"},"status":200};
      deferred.resolve(data); // Resolve the promise.
      createCuremployeeCtrl();
      $scope.$digest();
      expect($scope.employees).toBe(data.data);
    });
    describe('test current employee',function(){
      it('should set currentemployee if employeeNumber is match',function(){
        var data= {"data":
            [
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ],
          "status":200};
        deferred.resolve(data); // Resolve the promise.
        createCuremployeeCtrl();
        $scope.$digest();
        var currentemployee;
        for(var i=0; i<$scope.employees.length; i++){
            if($scope.employees[i].employeeNumber==$scope.ID){
              // $scope.curemployee=$scope.employees[i];
              currentemployee = $scope.employees[i];
              break;
            }
        }
        expect($scope.curemployee).not.toBe(null);
        expect($scope.curemployee).toEqual(currentemployee);
      });
      describe('when `$scope.curemployee.documents` undefined',function(){
        it('should set $scope.document to empty array',function(){
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "employeeNumber":"1000",
                "uid":"nsweet"
                },
                {
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
            ],
            "status":200};
            deferred.resolve(data); // Resolve the promise.
            createCuremployeeCtrl();
            $scope.$digest();
            var currentemployee;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  // $scope.curemployee=$scope.employees[i];
                  currentemployee = $scope.employees[i];
                  break;
                }
              }
          expect($scope.document).toBeEmptyArray();
          expect($scope.document.length).toEqual(0);
        });
      });
      describe('when `$scope.curemployee.documents` defined',function(){
        var currentemployee;
        beforeEach(inject(function(){
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "documents":[{"data":"files/1000/1000-nsweet-Photo.pdf","Description":"Photo","DocumentID":"0"}],
                  "employeeNumber":"1000",
                  },
                  {
                  "cn":"chartsfield",
                  "title":"TTP Trainer",
                  "uidNumber":"1000822",
                  "employeeNumber":"1000822",
                  "employeeType":"PT",
                  }
              ],
              "status":200};
              deferred.resolve(data); // Resolve the promise.
              createCuremployeeCtrl();
              $scope.$digest();

              for(var i=0; i<$scope.employees.length; i++){
                  if($scope.employees[i].employeeNumber==$scope.ID){
                    // $scope.curemployee=$scope.employees[i];
                    currentemployee = $scope.employees[i];
                    break;
                  }
                }
        }));
        it('should set $scope.document to curemployee.documents',function(){
            expect($scope.document).toEqual(currentemployee.documents);
        });
        it('it should set show_photo to true if DocumentID is 0',function(){
            expect($scope.show_photo).toBe(true);
        });
      });
      describe('when `$scope.curemployee.OtherDocuments` undefined',function(){
        it('should set $scope.document to empty array',function(){
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "employeeNumber":"1000",
                "uid":"nsweet"
                },
                {
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
            ],
            "status":200};
            deferred.resolve(data); // Resolve the promise.
            createCuremployeeCtrl();
            $scope.$digest();
            var currentemployee;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  // $scope.curemployee=$scope.employees[i];
                  currentemployee = $scope.employees[i];
                  break;
                }
              }
          expect($scope.other_documents).toBeEmptyArray();
          expect($scope.other_documents.length).toEqual(0);
        });
      });
      describe('when `$scope.curemployee.documents` defined',function(){
        it('should set $scope.other_documents to curemployee.OtherDocuments',function(){
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "OtherDocuments":[{"data":"files/1000/1000-nsweet-Other supporting document-detail.pdf","Description":"Other supporting document","DocumentID":"1"}],
                "employeeNumber":"1000",
                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
            ],
            "status":200};
            deferred.resolve(data); // Resolve the promise.
            createCuremployeeCtrl();
            $scope.$digest();
            var currentemployee;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  // $scope.curemployee=$scope.employees[i];
                  currentemployee = $scope.employees[i];
                  break;
                }
              }
            expect($scope.other_documents).toEqual(currentemployee.OtherDocuments);
        });
      });
      describe('when `$scope.curemployee.family_data` undefined',function(){
        it('should set $scope.family_data to empty',function(){
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "uidNumber":"1000",
                "employeeNumber":"1000",
                "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
            ],
            "status":200};
            deferred.resolve(data); // Resolve the promise.
            createCuremployeeCtrl();
            $scope.$digest();
            $rootscope.$digest();
            var currentemployee ;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  currentemployee = $scope.employees[i];
                  break;
                }
            }
            expect($scope.family_data).toBeEmptyArray();
            expect($scope.family_data.length).toEqual(0);
        });
        describe('when maritalstatus is Married and have children ',function(){
          it('should set $scope.family_data to array that exist object of spouse and children',function(){
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "uidNumber":"1000",
                  "employeeNumber":"1000",
                  "uid":"nsweet",
                  "maritalstatus":"Married",
                  "children":1

                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
              ],
              "status":200};
                deferred.resolve(data); // Resolve the promise.
                createCuremployeeCtrl();
                $scope.$digest();
                $rootscope.$digest();
                var currentemployee ;
                for(var i=0; i<$scope.employees.length; i++){
                    if($scope.employees[i].employeeNumber==$scope.ID){
                      currentemployee = $scope.employees[i];
                      break;
                    }
                }
                var family_data=[];
                var family_data_obj = {};
                //spouse
                family_data_obj['id'] = 0;
                family_data_obj['relationship'] = "spouse";
                family_data_obj['sn'] = "" ;
                family_data_obj['givenName'] = "";
                family_data_obj['C'] = "";
                family_data_obj['VisaExpires'] = "";
                family_data_obj['idnumber'] = "";
                family_data.push(family_data_obj);
                //children
                  for(var j=0; j<currentemployee.children; j++){
                     var family_child_obj = {};
                     family_child_obj['id'] = j+1;
                     family_child_obj['relationship'] = "child";
                     family_child_obj['sn'] ="" ;
                     family_child_obj['givenName'] = "";
                     family_child_obj['C'] = "";
                     family_child_obj['VisaExpires'] = "";
                     family_child_obj['idnumber'] = "";
                     family_data.push(family_child_obj);
                   }
              expect($scope.family_data).toEqual(family_data);
          });
        });
        describe('when maritalstatus is Single, but have children',function(){
          it('should set $scope.family_data to array that exist only object children',function(){
            var data= {"data":
                [
                {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "uidNumber":"1000",
                  "employeeNumber":"1000",
                  "uid":"nsweet",
                  "maritalstatus":"Single",
                  "children":1

                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
              ],
              "status":200};
              deferred.resolve(data); // Resolve the promise.
              createCuremployeeCtrl();
              $scope.$digest();
              $rootscope.$digest();
              var currentemployee ;
              for(var i=0; i<$scope.employees.length; i++){
                  if($scope.employees[i].employeeNumber==$scope.ID){
                    currentemployee = $scope.employees[i];
                    break;
                  }
              }
                var family_data=[];
                var family_data_obj = {};
                //children
                for(var j=0; j<currentemployee.children; j++){
                   var family_child_obj = {};
                   family_child_obj['id'] = j+1;
                   family_child_obj['relationship'] = "child";
                   family_child_obj['sn'] ="" ;
                   family_child_obj['givenName'] = "";
                   family_child_obj['C'] = "";
                   family_child_obj['VisaExpires'] = "";
                   family_child_obj['idnumber'] = "";
                   family_data.push(family_child_obj);
                 }
              expect($scope.family_data).toEqual(family_data);
          });
        });
      });
      describe('when `$scope.curemployee.family_data` defined',function(){
        it('should set $scope.family_data to $scope.curemployee.family_data',function(){
          var data= {"data":
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "family_data":[{"C":"BH","$$hashKey":"0PH","relationship":"child","idnumber":"12345","sn":"nice"}],
                "uidNumber":"1000",
                "employeeNumber":"1000",
                "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
            ],
            "status":200};
            deferred.resolve(data); // Resolve the promise.
            createCuremployeeCtrl();
            $scope.$digest();
            $rootscope.$digest();
            var currentemployee ;
            for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                currentemployee = $scope.employees[i];
                break;
              }
            }
            expect($scope.family_data).toEqual(currentemployee.family_data);
        });
        describe('if `$scope.curemployee.children` greater than children in family_data',function(){
          it('should add children to family_data and call updateUser()',function(){
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
                  "uidNumber":"1000",
                  "children":2,
                  "maritalstatus":"Married",
                  "employeeNumber":"1000",
                  "uid":"nsweet"
                  },
                  {
                  "cn":"chartsfield",
                  "title":"TTP Trainer",
                  "uidNumber":"1000822",
                  "employeeNumber":"1000822",
                  "employeeType":"PT",
                  }
              ],
              "status":200};
              deferred.resolve(data); // Resolve the promise.
              createCuremployeeCtrl();
              $scope.$digest();
              var currentemployee ;
              var family_data;
              //test
              employees=[
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "family_data":[
                    {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                    {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                    ],
                  "uidNumber":"1000",
                  "children":2,
                  "maritalstatus":"Married",
                  "employeeNumber":"1000",
                  "uid":"nsweet"
                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
                ];
              for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                  currentemployee = employees[i];
                  break;
                }
              }
              family_data = currentemployee.family_data;
              var count_add = currentemployee.children-((family_data.length-1));
              for(var j=0; j<count_add; j++){
                 var family_child_obj = {};
                 family_child_obj['id'] = family_data[family_data.length-1]['id']+1;
                 family_child_obj['relationship'] = "child";
                 family_child_obj['sn'] ="" ;
                 family_child_obj['givenName'] = "";
                 family_child_obj['C'] = "";
                 family_child_obj['VisaExpires'] = "";
                 family_child_obj['idnumber'] = "";
                 family_data.push(family_child_obj);
               }
            expect($scope.family_data).toEqual(family_data);
            expect($scope.updateUser).toHaveBeenCalled();
          });
        });
        //------------------------------------------
        describe('if `$scope.curemployee.children` equal children in family_data',function(){
          it('should set family_data children to curemployee.children',function(){
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                                {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                                ],
                  "uidNumber":"1000",
                  "children":1,
                  "maritalstatus":"Married",
                  "employeeNumber":"1000",
                  "uid":"nsweet"
                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
              ],
              "status":200};
              deferred.resolve(data); // Resolve the promise.
              createCuremployeeCtrl();
              $scope.$digest();
              var currentemployee ;
              var family_data;
              //test
              employees=[
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "family_data":[
                    {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                    {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                    ],
                  "uidNumber":"1000",
                  "children":1,
                  "maritalstatus":"Married",
                  "employeeNumber":"1000",
                  "uid":"nsweet"
                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
                ];
              for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                  currentemployee = employees[i];
                  break;
                }
              }
              family_data = currentemployee.family_data;
            expect($scope.family_data).toEqual(family_data);
          });
        });
        describe('if `$scope.curemployee.children` less than children in family_data',function(){
          it('should remove children to family_data and call updateUser()',function(){
            var data= {"data":
                [
                  {
                  "departmentNumber":"LIS",
                  "displayName":"nsweet",
                  "cn":"nsweet",
                  "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
                  "uidNumber":"1000",
                  "children":1,
                  "maritalstatus":"Married",
                  "employeeNumber":"1000",
                  "uid":"nsweet"
                },
                {
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                }
              ],
              "status":200};
                deferred.resolve(data); // Resolve the promise.
                createCuremployeeCtrl();
                $scope.$digest();
                var currentemployee ;
                var family_data;
              //test
              employees=[
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
                "uidNumber":"1000",
                "children":1,
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
              ];;
              for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                  currentemployee = employees[i];
                  break;
                }
              }
              family_data = currentemployee.family_data;
               var count_remove = (family_data.length-1)-currentemployee.children;
               family_data.splice(-count_remove);
              expect($scope.family_data).toEqual(family_data);
            expect($scope.updateUser).toHaveBeenCalled();
          });
        });
      });
    });
  });
  //============================================================================================
  describe('test employees not null',function(){
    it('should set currentemployee if employeeNumber is match',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
      var currentemployee ;
      for(var i=0; i<$scope.employees.length; i++){
          if($scope.employees[i].employeeNumber==$scope.ID){
            // $scope.curemployee=$scope.employees[i];
            currentemployee = $scope.employees[i];
            break;
          }
      }
      expect($scope.curemployee).toEqual(currentemployee);
    });
    describe('when `$scope.curemployee.documents` undefined',function(){
      it('should set $scope.document to empty array',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
      var currentemployee ;
      for(var i=0; i<$scope.employees.length; i++){
          if($scope.employees[i].employeeNumber==$scope.ID){
            // $scope.curemployee=$scope.employees[i];
            currentemployee = $scope.employees[i];
            break;
          }
      }
      expect($scope.document).toBeEmptyArray();
      expect($scope.document.length).toEqual(0);
      });
    });
    describe('when `$scope.curemployee.OtherDocuments` undefined',function(){
      it('should set $scope.other_documents to empty array',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var currentemployee ;
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                // $scope.curemployee=$scope.employees[i];
                currentemployee = $scope.employees[i];
                break;
              }
          }
        expect($scope.other_documents).toBeEmptyArray();
        expect($scope.other_documents.length).toEqual(0);
      });
    });
    describe('when `$scope.curemployee.documents` defined',function(){
      it('should set $scope.document to curemployee.documents',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "documents":[{"data":"files/1000/1000-nsweet-Physical Examination Report.pdf","Description":"Physical Examination Report","DocumentID":"9"}],
            "employeeNumber":"1000",
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
      var currentemployee ;
      for(var i=0; i<$scope.employees.length; i++){
          if($scope.employees[i].employeeNumber==$scope.ID){
            currentemployee = $scope.employees[i];
            break;
          }
      }
      expect($scope.document).toEqual(currentemployee.documents);
      });
    });
    describe('when `$scope.curemployee.OtherDocuments` defined',function(){
      it('should set $scope.other_documents to curemployee.OtherDocuments',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "OtherDocuments":[{"Description":"other document","DocumentID":"9"}],
            "employeeNumber":"1000",
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
        var currentemployee ;
        for(var i=0; i<$scope.employees.length; i++){
            if($scope.employees[i].employeeNumber==$scope.ID){
              currentemployee = $scope.employees[i];
              break;
            }
        }
        expect($scope.other_documents).toEqual(currentemployee.OtherDocuments);
      });
    });
    describe('when `$scope.curemployee.family_data` undefined',function(){
      it('should set $scope.family_data to empty',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var currentemployee ;
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                currentemployee = $scope.employees[i];
                break;
              }
          }
          expect($scope.document).toBeEmptyArray();
          expect($scope.document.length).toEqual(0);
      });
      describe('when maritalstatus is Married and have children ',function(){
        it('should set $scope.family_data to array that exist object of spouse and children',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "employeeNumber":"1000",
              "uid":"nsweet",
              "maritalstatus":"Married",
              "children":1

            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var currentemployee ;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  currentemployee = $scope.employees[i];
                  break;
                }
            }
              var family_data=[];
              var family_data_obj = {};
              //spouse
              family_data_obj['id'] = 0;
              family_data_obj['relationship'] = "spouse";
              family_data_obj['sn'] = "" ;
              family_data_obj['givenName'] = "";
              family_data_obj['C'] = "";
              family_data_obj['VisaExpires'] = "";
              family_data_obj['idnumber'] = "";
              family_data.push(family_data_obj);
              //children
                for(var j=0; j<currentemployee.children; j++){
                   var family_child_obj = {};
                   family_child_obj['id'] = j+1;
                   family_child_obj['relationship'] = "child";
                   family_child_obj['sn'] ="" ;
                   family_child_obj['givenName'] = "";
                   family_child_obj['C'] = "";
                   family_child_obj['VisaExpires'] = "";
                   family_child_obj['idnumber'] = "";
                   family_data.push(family_child_obj);
                 }
            expect($scope.family_data).toEqual(family_data);
        });
      });
      describe('when maritalstatus is Single, but have children',function(){
        it('should set $scope.family_data to array that exist only object children',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "employeeNumber":"1000",
              "uid":"nsweet",
              "maritalstatus":"Single",
              "children":1

            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var currentemployee ;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                  currentemployee = $scope.employees[i];
                  break;
                }
            }
              var family_data=[];
              var family_data_obj = {};
              //children
              for(var j=0; j<currentemployee.children; j++){
                 var family_child_obj = {};
                 family_child_obj['id'] = j+1;
                 family_child_obj['relationship'] = "child";
                 family_child_obj['sn'] ="" ;
                 family_child_obj['givenName'] = "";
                 family_child_obj['C'] = "";
                 family_child_obj['VisaExpires'] = "";
                 family_child_obj['idnumber'] = "";
                 family_data.push(family_child_obj);
               }
            expect($scope.family_data).toEqual(family_data);
        });
      });
    });
    describe('when `$scope.curemployee.family_data` defined',function(){
      it('should set $scope.family_data to $scope.curemployee.family_data',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "family_data":[{"C":"BH","$$hashKey":"0PH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "uidNumber":"1000",
            "employeeNumber":"1000",
            "uid":"nsweet"
          },
          {
          "cn":"chartsfield",
          "title":"TTP Trainer",
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var currentemployee ;
          for(var i=0; i<$scope.employees.length; i++){
            if($scope.employees[i].employeeNumber==$scope.ID){
              currentemployee = $scope.employees[i];
              break;
            }
          }
          expect($scope.family_data).toEqual(currentemployee.family_data);
      });
      describe('if `$scope.curemployee.children` greater than children in family_data',function(){
        it('should add children to family_data and call updateUser()',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
              "uidNumber":"1000",
              "children":2,
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var currentemployee ;
            var family_data;
            //test
            employees=[
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "family_data":[
                  {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                  ],
                "uidNumber":"1000",
                "children":2,
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
              ];
            for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                currentemployee = employees[i];
                break;
              }
            }
            family_data = currentemployee.family_data;
            var count_add = currentemployee.children-((family_data.length-1));
            for(var j=0; j<count_add; j++){
               var family_child_obj = {};
               family_child_obj['id'] = family_data[family_data.length-1]['id']+1;
               family_child_obj['relationship'] = "child";
               family_child_obj['sn'] ="" ;
               family_child_obj['givenName'] = "";
               family_child_obj['C'] = "";
               family_child_obj['VisaExpires'] = "";
               family_child_obj['idnumber'] = "";
               family_data.push(family_child_obj);
             }
          expect($scope.family_data).toEqual(family_data);
          expect($scope.updateUser).toHaveBeenCalled();
        });
      });
      describe('if `$scope.curemployee.children` equal children in family_data',function(){
        it('should set family_data children to curemployee.children',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                            {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                            ],
              "uidNumber":"1000",
              "children":1,
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var currentemployee ;
            var family_data;
            //test
            employees=[
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "family_data":[
                  {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                  ],
                "uidNumber":"1000",
                "children":1,
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
              ];
            for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                currentemployee = employees[i];
                break;
              }
            }
            family_data = currentemployee.family_data;
          expect($scope.family_data).toEqual(family_data);
        });
      });
      describe('if `$scope.curemployee.children` less than children in family_data',function(){
        it('should remove children to family_data and call updateUser()',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
              "uidNumber":"1000",
              "children":1,
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var currentemployee ;
            var family_data;
            //test
            employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
              "uidNumber":"1000",
              "children":1,
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
            ];;
            for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                currentemployee = employees[i];
                break;
              }
            }
            family_data = currentemployee.family_data;
             var count_remove = (family_data.length-1)-currentemployee.children;
             family_data.splice(-count_remove);
            expect($scope.family_data).toEqual(family_data);
          expect($scope.updateUser).toHaveBeenCalled();
        });
      });
    });
  });
  describe('test function defined ',function(){
    it('it should have shift function',function(){
      expect($scope.shift).toBeDefined();
    });
    it('it should have clearEmployee function',function(){
      expect($scope.clearEmployee).toBeDefined();
    });
    it('it should have updateFamilyData function',function(){
      expect($scope.updateFamilyData).toBeDefined();
    });
    it('it should have addImportFile function',function(){
      expect($scope.addImportFile).toBeDefined();
    });
  });
  describe('test function called ',function(){
  describe('When clearEmployee() function called should set $scope.curemployee = null',function(){
      it('should set $scope.curemployee = null',function(){
        $scope.clearEmployee();
        expect($scope.curemployee).toBe(null);
      });
  });
  describe('when shift() called',function(){
    it('should set url location to /admin/staff/ID',function(){
      $scope.employees=[
          {
          "uidNumber":"1000822",
          "employeeNumber":"1000822",
          "employeeType":"PT",
          },
          {
          "departmentNumber":"LIS",
          "employeeNumber":"1000",
          "uid":"nsweet"
          }
        ];
        employees=[
            {
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            },
            {
            "departmentNumber":"LIS",
            "employeeNumber":"1000",
            "uid":"nsweet"
            }
          ];
        // $rootscope.$digest();
        createCuremployeeCtrl();
        var amount = -1;
        $scope.shift(amount);
        var currentEmployee;
        for(var i=0; i<employees.length; i++){
            if(employees[i].employeeNumber==$scope.ID){
                currentEmployee = employees[i+amount];
            }
        }
        expect($location.path).toHaveBeenCalledWith('/admin/staff/'+currentEmployee.employeeNumber);
    });
    describe('if shift() was called with -1',function(){
      it('should set curemployee to curemployee[index-1]',function(){
        $scope.employees=[
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            },
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            }
          ];
          employees=[
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            },
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            }
            ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = -1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                  currentEmployee = employees[i+amount];
              }
          }
          expect($scope.curemployee).toEqual(currentEmployee);
      });
    });
    describe('if shift() was called with +1',function(){
      it('should set curemployee to curemployee[index+1]',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "family_data":[{"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},{"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }

            ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = +1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                  currentEmployee = employees[i+amount];
              }
          }
          expect($scope.curemployee).toEqual(currentEmployee);
      });
    });
    describe('when curemployee.documents undefined',function(){
      it('should set $scope.document to empty array',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = +1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                  currentEmployee = $scope.employees[i+amount];
              }
          }
          expect($scope.document).toBeEmptyArray();
      });
    });
    describe('when curemployee.documents defined',function(){
      var amount = +1;
      var currentEmployee;
      beforeEach(inject(function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "documents":[{"data":"files/1000/1000-nsweet-Photo.pdf","Description":"Photo","DocumentID":"0"}],
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          $scope.shift(amount);
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                  currentEmployee = $scope.employees[i+amount];
              }
          }
      }));
      it('should set $scope.document to curemployee.documents',function(){
          expect($scope.document).toEqual(currentEmployee.documents);
      });
      it('it should set show_photo to true if documentID is 0',function(){
          expect($scope.show_photo).toBe(true);
      });
    });
    describe('when curemployee.OtherDocuments undefined',function(){
      it('should set $scope.other_documents to empty array',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = +1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<employees.length; i++){
              if(employees[i].employeeNumber==$scope.ID){
                  currentEmployee = employees[i+amount];
              }
          }
          expect($scope.other_documents).toBeEmptyArray();
      });
    });
    describe('when curemployee.OtherDocuments defined',function(){
      it('should set $scope.other_documents to curemployee.OtherDocuments',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "OtherDocuments":[{'Description':'other document'}],
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = +1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                  currentEmployee = $scope.employees[i+amount];
              }
          }
          expect($scope.other_documents).toEqual(currentEmployee.OtherDocuments);
      });
    });
    describe('when curemployee.family_data undefined',function(){
      it('should set $scope.family_data to curemployee.family_data',function(){
        $scope.employees=[
            {
            "departmentNumber":"LIS",
            "displayName":"nsweet",
            "cn":"nsweet",
            "uidNumber":"1000",
            "children":2,
            "maritalstatus":"Married",
            "employeeNumber":"1000",
            "uid":"nsweet"
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            }
          ];
          $rootscope.$digest();
          createCuremployeeCtrl();
          var amount = +1;
          $scope.shift(amount);
          var currentEmployee;
          for(var i=0; i<$scope.employees.length; i++){
              if($scope.employees[i].employeeNumber==$scope.ID){
                  currentEmployee = $scope.employees[i+amount];
              }
          }
          expect($scope.family_data).toBeEmptyArray();
      });
      describe('when maritalstatus is Married and have children ',function(){
        it('should set $scope.family_data to array that exist object of spouse and children',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "employeeNumber":"1000",
              "uid":"nsweet"
              },
              {
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "children":2,
              "maritalstatus":"Married",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              }
            ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var amount = +1;
            $scope.shift(amount);
            var currentEmployee;
            for(var i=0; i<$scope.employees.length; i++){
                if($scope.employees[i].employeeNumber==$scope.ID){
                    currentEmployee = $scope.employees[i+amount];
                    break;
                }
            }
              var family_data=[];
              var family_data_obj = {};
              //spouse
              family_data_obj['id'] = 0;
              family_data_obj['relationship'] = "spouse";
              family_data_obj['sn'] = "" ;
              family_data_obj['givenName'] = "";
              family_data_obj['C'] = "";
              family_data_obj['VisaExpires'] = "";
              family_data_obj['idnumber'] = "";
              family_data.push(family_data_obj);
              //children
                for(var j=0; j<currentEmployee.children; j++){
                   var family_child_obj = {};
                   family_child_obj['id'] = j+1;
                   family_child_obj['relationship'] = "child";
                   family_child_obj['sn'] ="" ;
                   family_child_obj['givenName'] = "";
                   family_child_obj['C'] = "";
                   family_child_obj['VisaExpires'] = "";
                   family_child_obj['idnumber'] = "";
                   family_data.push(family_child_obj);
                 }
            expect($scope.family_data).toEqual(family_data);
        });
      });
      describe('when maritalstatus is Single, but have children',function(){
        it('should set $scope.family_data to array that exist only object children',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "employeeNumber":"1000",
              "uid":"nsweet",
            },
            {
            "cn":"chartsfield",
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            "maritalstatus":"Single",
            "children":1
            }
            ];
              $rootscope.$digest();
              createCuremployeeCtrl();
              var amount = +1;
              $scope.shift(amount);
              var currentEmployee;
              for(var i=0; i<$scope.employees.length; i++){
                  if($scope.employees[i].employeeNumber==$scope.ID){
                      currentEmployee = $scope.employees[i+amount];
                      break;
                  }
              }
              var family_data=[];
              var family_data_obj = {};
              //children
              for(var j=0; j<currentEmployee.children; j++){
                 var family_child_obj = {};
                 family_child_obj['id'] = j+1;
                 family_child_obj['relationship'] = "child";
                 family_child_obj['sn'] ="" ;
                 family_child_obj['givenName'] = "";
                 family_child_obj['C'] = "";
                 family_child_obj['VisaExpires'] = "";
                 family_child_obj['idnumber'] = "";
                 family_data.push(family_child_obj);
               }
            expect($scope.family_data).toEqual(family_data);
        });
      });
    });
    describe('when `$scope.curemployee.family_data` defined',function(){
      it('should set $scope.family_data to $scope.curemployee.family_data',function(){
          $scope.employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "employeeNumber":"1000",
              "uid":"nsweet",
            },
            {
            "cn":"chartsfield",
            "family_data":[{"C":"BH","$$hashKey":"0PH","relationship":"child","idnumber":"12345","sn":"nice"}],
            "title":"TTP Trainer",
            "uidNumber":"1000822",
            "employeeNumber":"1000822",
            "employeeType":"PT",
            "maritalstatus":"Single",
            "children":1
            }
            ];
              $rootscope.$digest();
              createCuremployeeCtrl();
              var amount = +1;
              $scope.shift(amount);
              var currentEmployee;
              for(var i=0; i<$scope.employees.length; i++){
                  if($scope.employees[i].employeeNumber==$scope.ID){
                      currentEmployee = $scope.employees[i+amount];
                      break;
                  }
              }
          expect($scope.family_data).toEqual(currentEmployee.family_data);
      });
      describe('if `$scope.curemployee.children` greater than children in family_data',function(){
        it('should add children to family_data and call updateUser()',function(){
          $scope.employees=
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "uidNumber":"1000",
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
                },
                {
                "children":2,
                "family_data":[
                  {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                  ],
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                "uid":"username"
                }
              ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var amount = +1;
            $scope.shift(amount);
            var currentemployee ;
            var family_data;
            //test
            employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
              },
              {
              "children":2,
              "family_data":[
                {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                ],
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              "uid":"username"
              }
              ];
            // currentemployee = $scope.curemployee;
            var currentEmployee;
            for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                    currentEmployee = employees[i+amount];
                    break;
                }
            }
            family_data = currentEmployee.family_data;
            var count_add = currentEmployee.children-((family_data.length-1));
            for(var j=0; j<count_add; j++){
               var family_child_obj = {};
               family_child_obj['id'] = family_data[family_data.length-1]['id']+1;
               family_child_obj['relationship'] = "child";
               family_child_obj['sn'] ="" ;
               family_child_obj['givenName'] = "";
               family_child_obj['C'] = "";
               family_child_obj['VisaExpires'] = "";
               family_child_obj['idnumber'] = "";
               family_data.push(family_child_obj);
             }
          expect($scope.family_data).toEqual(family_data);
          expect($scope.updateUser).toHaveBeenCalled();
        });
      });
      describe('if `$scope.curemployee.children` equal children in family_data',function(){
        it('should set family_data children to curemployee.children',function(){
          $scope.employees=
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "uidNumber":"1000",
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
                },
                {
                "children":1,
                "family_data":[
                  {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                  ],
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                "uid":"username"
                }
              ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var amount = +1;
            $scope.shift(amount);
            var currentemployee ;
            var family_data;
            //test
            employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
              },
              {
              "children":1,
              "family_data":[
                {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                ],
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              "uid":"username"
              }
              ];
            // currentemployee = $scope.curemployee;
            var currentEmployee;
            for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                    currentEmployee = employees[i+amount];
                    break;
                }
            }
            family_data = currentEmployee.family_data;
            expect($scope.family_data).toEqual(family_data);
        });
      });
      describe('if `$scope.curemployee.children` less than children in family_data',function(){
        it('should set family_data children to curemployee.children',function(){
          $scope.employees=
              [
                {
                "departmentNumber":"LIS",
                "displayName":"nsweet",
                "cn":"nsweet",
                "uidNumber":"1000",
                "maritalstatus":"Married",
                "employeeNumber":"1000",
                "uid":"nsweet"
                },
                {
                "children":1,
                "family_data":[
                  {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                  {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                  ],
                "cn":"chartsfield",
                "title":"TTP Trainer",
                "uidNumber":"1000822",
                "employeeNumber":"1000822",
                "employeeType":"PT",
                "uid":"username"
                }
              ];
            $rootscope.$digest();
            createCuremployeeCtrl();
            var amount = +1;
            $scope.shift(amount);
            var currentemployee ;
            var family_data;
            //test
            employees=[
              {
              "departmentNumber":"LIS",
              "displayName":"nsweet",
              "cn":"nsweet",
              "uidNumber":"1000",
              "maritalstatus":"Married",
              "employeeNumber":"1000",
              "uid":"nsweet"
              },
              {
              "children":1,
              "family_data":[
                {"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
                {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"},
                {"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
                ],
              "cn":"chartsfield",
              "title":"TTP Trainer",
              "uidNumber":"1000822",
              "employeeNumber":"1000822",
              "employeeType":"PT",
              "uid":"username"
              }
              ];
            // currentemployee = $scope.curemployee;
            var currentEmployee;
            for(var i=0; i<employees.length; i++){
                if(employees[i].employeeNumber==$scope.ID){
                    currentEmployee = employees[i+amount];
                    break;
                }
            }
            family_data = currentEmployee.family_data;
            var count_remove = (family_data.length-1)-currentEmployee.children;
            family_data.splice(-count_remove);
            expect($scope.family_data).toEqual(family_data);
            expect($scope.updateUser).toHaveBeenCalled();
        });
      });
    });
  });
  //++++++++++++++++++++++++++++++++++++++
  describe('when updateFamilyData() called',function(){
    it('should return the correct updated family_data',function(){
      $scope.family_data = [
          {"id":1,"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
          {"id":2,"C":"BH","relationship":"child","idnumber":"12345","sn":"nice"}
      ];
      var updated_data =[
            {"id":1,"C":"BH","relationship":"spouse","idnumber":"12345","sn":"nice"},
            {"id":2,"C":"KH","relationship":"child","idnumber":"12345","sn":"nice"}
        ];
      expect($scope.updateFamilyData("KH", 2,"C")).toEqual(JSON.stringify(updated_data));
    });
  });
  describe('when addImportFile() called',function(){
    beforeEach(inject(function(){
      $scope.curemployee=[
          {
          "departmentNumber":"LIS",
          "uidNumber":"1000",
          "documents":[
            {"Description":"Photo","DocumentID":"0"},
            {"Description":"Statement of Faith","DocumentID":"2"}
          ],
          "employeeNumber":"1000",
          "uid":"nsweet"
          }
        ];
    }));
    describe('test with other supporting document exist',function(){
      beforeEach(inject(function($rootScope) {
          $scope.other_documents=[
            {"Description":"other","DocumentID":"0"},
            {"Description":"test","DocumentID":"1"},
          ];
          $scope.otherDoc.otherDocDescript="other";
          $scope.DocumentData.Documenttype={
            text:'Other supporting document',
            value:'16'
          };
      }));
      it('it should set files_exist to duplicate',function(){
        $scope.addImportFile();
        $rootscope.$digest();
        expect($scope.files_exist).toEqual('duplicate');
      });
      it('should be alert message',function(){
        $scope.addImportFile();
        $rootscope.$digest();
        expect($window.alert).toHaveBeenCalledWith('Other Documents Description Already Exist! Please Change Description.');
      });
    });
    describe('test with file exist',function(){
      beforeEach(inject(function($rootScope) {
          $scope.document=[
            {"Description":"Photo","DocumentID":"0"},
            {"Description":"Statement of Faith","DocumentID":"2"}
          ];
          $scope.DocumentData.Documenttype={
            text:'Photo',
            value:'0'
          };
      }));
      describe('test confirm yes',function(){
        beforeEach(inject(function($rootScope) {
            spyOn($window,'confirm').and.returnValue(true);
        }));
        it('should set files_exist to true',function(){
            $scope.addImportFile();
            $rootscope.$digest();
            expect($scope.files_exist).toBeDefined();
            expect($scope.files_exist).toBe(true);
        });
        it('Document_exist should be null',function(){
            // spyOn($window,'confirm').and.returnValue(true);
            $scope.addImportFile();
            $rootscope.$digest();
            var documents = $scope.document;
            var DocDataExist;
            for (var i = 0; i<documents.length; i++){
              if(documents[i]['DocumentID']==$scope.DocumentData.Documenttype.value && $scope.DocumentData.Documenttype.value!=16){
                var DocDataExist = documents[i];
              }
            }
            expect($scope.Document_exist).toEqual(DocDataExist);
        });
        it('should called uploadFile() in EmployeesService',function(){
            $scope.addImportFile();
            expect(EmployeesService.uploadFile).toHaveBeenCalled();
        });
        it('when result return success should call $scope.updateUser()',function(){
            var data= {"data":{result:"success"},"status":200};
            deferred.resolve(data);
            $scope.addImportFile();
            $rootscope.$digest();
            expect($scope.updateUser).toHaveBeenCalled();
        });
        it('when result return success should set $scope.upload_sms `Replace file successfully!`',function(){
            var data= {"data":{result:"success"},"status":200};
            deferred.resolve(data);
            $scope.addImportFile();
            $rootscope.$digest();
            expect($scope.upload_sms).toEqual('Replace file successfully!');
        });
        it('when result return error should set $scope.upload_sms `Upload file fail!`',function(){
            var data= {"data":{result:"error"},"status":200};
            deferred.resolve(data);
            $scope.addImportFile();
            $rootscope.$digest();
            expect($scope.upload_sms).toEqual('Upload file fail!');
        });
        it('when server error should set $scope.upload_sms `Server error!`',function(){
            deferred.reject(400);
            $scope.addImportFile();
            $rootscope.$digest();
            expect($scope.upload_sms).toEqual('Server error!');
        });
      });
      // describe('test confirm no',function(){
      //   var spyEvent;
      //   beforeEach(inject(function($rootScope) {
      //       spyOn($window,'confirm').and.returnValue(false);
      //       setFixtures('<form id="formUpload" class="div"></form>');
      //
      //   }));
      //   it('it should reset form',function(){
      //     $rootscope.$digest();
      //     $scope.addImportFile();
      //     spyEvent = spyOnEvent('#formUpload', 'trigger');
      //     expect('reset').toHaveBeenTriggeredOn('#formUpload');
      //     // expect(spyEvent).toHaveBeenCalledWith('reset');
      //   });
      // });
    });
    describe('test file not exist',function(){
      beforeEach(inject(function($rootScope) {
          $scope.document=[
            {"Description":"Photo","DocumentID":"0"},
            {"Description":"Statement of Faith","DocumentID":"2"}
          ];
          $scope.DocumentData.Documenttype={
            text:'Photo',
            value:'9'
          };
      }));
      it('should called uploadFile() in EmployeesService',function(){
        $scope.addImportFile();
        $rootscope.$digest();
        expect(EmployeesService.uploadFile).toHaveBeenCalled();
      });
      it('when server error should set $scope.upload_sms `Server error!`',function(){
          deferred.reject(400);
          $scope.addImportFile();
          $rootscope.$digest();
          expect($scope.upload_sms).toEqual('Server error!');
      });
      it('when result return error should set $scope.upload_sms `Upload file fail!`',function(){
          var data= {"data":{result:"error"},"status":200};
          deferred.resolve(data);
          $scope.addImportFile();
          $rootscope.$digest();
          expect($scope.upload_sms).toEqual('Upload file fail!');
      });
      it('when result return success should set $scope.upload_sms `Upload file successfully!`',function(){
          var data= {"data":{result:"success"},"status":200};
          deferred.resolve(data);
          $scope.addImportFile();
          $rootscope.$digest();
          expect($scope.upload_sms).toEqual('Upload file successfully!');
      });
      describe('test with other supporting document',function(){
        beforeEach(inject(function($rootScope) {
          $scope.DocumentData.Documenttype={
            text:'Other supporting document',
            value:'16'
          };
          $scope.documents=[
            {"Description":"other doc","DocumentID":1}
          ];

        }));
        it('should called updateUser() with OtherDocuments',function(){
          var data= {"data":{result:"success"},"status":200};
          deferred.resolve(data);
          $scope.addImportFile();
          $rootscope.$digest();
          expect($scope.updateUser).toHaveBeenCalledWith($scope.curemployee.uid,'OtherDocuments',JSON.stringify($scope.other_documents));
        });
      });
      describe('test with  document',function(){
        beforeEach(inject(function($rootScope) {
            $scope.DocumentData.Documenttype={
              text:'CV/Resume',
              value:'3'
            };
        }));
        it('should called updateUser() with documents',function(){
          var data= {"data":{result:"success"},"status":200};
          deferred.resolve(data);
          $scope.addImportFile();
          $rootscope.$digest();
          expect($scope.updateUser).toHaveBeenCalledWith($scope.curemployee.uid,'documents',JSON.stringify($scope.document));
        });
      });
    });
  });
  });
});
