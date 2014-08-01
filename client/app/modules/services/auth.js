angular.module('waddle.services.auth', [])
  .factory('Auth', function ($q) {

    var checkLogin = function () {
      var deferred = $q.defer();

      openFB.getLoginStatus(function(response){
        if (response.status === 'connected'){
          console.log('connected')
          deferred.resolve();
        } else {
          console.log('not connected')
          deferred.reject();
        }
      });

      return deferred.promise;
    };

    return {
      checkLogin: checkLogin
    }
    
  })