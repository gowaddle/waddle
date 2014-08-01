angular.module('waddle.services.serverFactory', [])  

.factory('UserRequests', function($http){
  var addUser = function(data){
    return $http({
      method: 'POST',
      data: data,
      url: '/api/users/' + user + '/adduser'
    });
  };

  var getUserData = function(user){
    return $http({
      method: 'GET',
      url: '/api/users/' + user
    });
  };

  return {
    addUser: addUser,
    getUserData: getUserData
  };
});
