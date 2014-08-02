angular.module('waddle.services.serverFactory', [])  

.factory('UserRequests', function($http){
  var sendUserData = function(data){
    return $http({
      method: 'POST',
      data: data,
      url: '/api/users/userdata'
    });
  };

  var getUserData = function(user){
    return $http({
      method: 'GET',
      url: '/api/users/' + user
    });
  };

  return {
    sendUserData: sendUserData,
    getUserData: getUserData
  };
});
