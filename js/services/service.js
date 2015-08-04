(function () {
      'use strict';
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
      app.factory('EmployeesService', function($http) {
        return {
          getEmployees : function(username,password,scope) {
                // return $http.get('/api/todos');
                var data = {
                      username: username,
                      pw: password,
                      // scope:'CURSTAFF'
                      scope:scope
                      }
                var uri = encodeURI('cgi-bin/dump.cgi');
                return $http({
                        method  : 'POST',
                        url     : uri,
                        data    : $.param(data),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                      });
            },
            updateEmployees : function(uid,field,data,username,password) {
              var encoded_data = encodeURIComponent(data);
              var data = {
                  uid: uid,
                  field: field,
                  data:encoded_data,
                  username:username,
                  pw:password
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
                    reset_type:type
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
                  }
        }
      });
  }());
