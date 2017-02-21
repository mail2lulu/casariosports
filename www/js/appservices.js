(function() {
    'use strict';
    angular
        .module('starter.services', [])
        .service('AppService', AppService);
   
    function AppService($q, $http) {
        console.log("pppp AppService");
        return {            
            getDataFromUrl: function(myUrl, dataObj) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var req = {
                    method: 'get',
                    url: myUrl
                }
                $http(req).then(function(response) {
                    if (response.data) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject('Something went wrong in getting details.');
                    }
                }, function(response) {
                    deferred.reject('Something went wrong server call. response : ', response);
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    }

})();
