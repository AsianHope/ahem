(function () {
      'use strict';

      app.factory('modalDialog', ['$window', function($window) {
        return {
            confirm: function(message) {
                return $window.confirm(message);
            }
        }
      }]);
      app.factory('storageService', function ($rootScope) {
        return {

            get: function (key) {
               return localStorage.getItem(key);
            },
            save: function (key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            },
            remove: function (key) {
                localStorage.removeItem(key);
            },
            clearAll : function () {
                localStorage.clear();
            }
        };
    });
    angular.module('Service', []).factory('EmployeesService', function($http) {
        return {
          getEmployees : function(username,password,scope) {
                // return $http.get('/api/todos');
                var data = {
                      "username": username,
                      "pw": password,
                      // scope:'CURSTAFF'
                      "scope":scope
                      }
                var uri = encodeURI('cgi-bin/dump.cgi');
                return $http({
                        "method"  : "POST",
                        "url"     : uri,
                        "data"    : $.param(data),  // pass in data as strings
                        "headers" : {"Content-Type": "application/x-www-form-urlencoded" }  // set the headers so angular passing info as form data (not request payload)
                      });
            },
            updateEmployees : function(uid,field,data,username,password,cn,modifyType) {
              var encoded_data = encodeURIComponent(data);
              var data = {
                  uid: uid,
                  field: field,
                  data:encoded_data,
                  username:username,
                  pw:password,
                  cn:cn,
                  modifyType:modifyType
                  }
              var uri = encodeURI('cgi-bin/update.cgi');
              return $http({
                    method  : 'POST',
                    url     : uri,
                    data    : $.param(data),  // pass in data as strings
                    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                  })
              },
              resetPassword : function(uid,data,username,password,type) {
                var encoded_data = encodeURIComponent(data);
                var data = {
                    uid: uid,
                    field: "userPassword",
                    data:encoded_data,
                    username:username,
                    pw:password,
                    reset_type:type,
                    cn:'users',
                    modifyType:'null'
                    }
                var uri = encodeURI('cgi-bin/update.cgi');
                return $http({
                      method  : 'POST',
                      url     : uri,
                      data    : $.param(data),  // pass in data as strings
                      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                    })
                },
                addEmployee : function(formdata) {
                  var uri = encodeURI('cgi-bin/register.cgi');
                  return $http({
                        method  : 'POST',
                        url     : uri,
                        data    : $.param(formdata),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                       })
                  },
                uploadFile : function(file,uidNumber,uid,Document_type,Document_ID,Document_exist,otherDocDescript) {
                  var formData = new FormData();
                  formData.append('file', file);
                  formData.append('uidnumber',uidNumber);
                  formData.append('loginName',uid);
                  formData.append('documentType',Document_type);
                  formData.append('filename',Document_exist);
                  formData.append('DocumentID',Document_ID);
                  formData.append('otherDocDescript',otherDocDescript);
                  var uri = encodeURI('cgi-bin/upload.cgi');
                  return $http({
                          method  : 'POST',
                          url     : uri,
                          data    : formData,
                          headers: {'Content-Type': undefined},
                          transformRequest: angular.identity
                        })
                  },
                  approveAccount : function(username,password,uid) {
                    var encoded_data = encodeURIComponent(data);
                    var data = {
                        username:username,
                        pw:password,
                        uid:uid,
                        }
                    var uri = encodeURI('cgi-bin/approveAccount.cgi');
                    return $http({
                          method  : 'POST',
                          url     : uri,
                          data    : $.param(data),  // pass in data as strings
                          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                        })
                    },
                    sendSMS : function(userList,title,message) {
                      var data = {
                          userList : "['" + userList.join("','") + "']",
                          title : title,
                          message : message,
                          }
                      var uri = encodeURI('cgi-bin/sendSMS.cgi');
                      return $http({
                            method  : 'POST',
                            url     : uri,
                            data    : $.param(data),  // pass in data as strings
                            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                          })
                      },
                      syncGADS : function() {
                        var data = {
                            }
                        var uri = encodeURI('http://192.168.1.157/cgi-bin/triggersync');
                        return $http({
                              method  : 'POST',
                              url     : uri,
                              data    : $.param(data),  // pass in data as strings
                              headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                            })
                        },
        }
      });
  }());
