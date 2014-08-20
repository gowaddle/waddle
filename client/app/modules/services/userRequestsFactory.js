angular.module('waddle.services.userRequestsFactory', [])  

.factory('UserRequests', function ($http) {
  var userData;

  return {
    allData: userData,

    sendUserData: function (data) {
      if(data) {
        return $http({
          method: 'POST',
          data: data,
          url: '/api/users/userdata'
        })
      }
    },

    getUserData: function (userFbID) {
      if (userFbID) {
        return $http({
          method: 'GET',
          url: '/api/users/' + userFbID
        });
      }
    }
  };
});
