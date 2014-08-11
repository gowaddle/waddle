angular.module('waddle.services.serverFactory', [])  

.factory('UserRequests', function($http){
  var data = undefined;

  return {
    allData: data,
    sendUserData: function(data){
      return $http({
        method: 'POST',
        data: data,
        url: '/api/users/userdata'
      })
    },

    getUserData: function(user){
      return $http({
        method: 'GET',
        url: '/api/users/' + user
      });
    }
  };
});
