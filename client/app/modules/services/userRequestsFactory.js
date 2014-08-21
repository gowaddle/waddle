// Requests to server sending and retrieving data for specific users
var UserRequests = function ($http){
  var userData;

  return {
    allData: userData,

    // Sends request to server with relevant user data 
    // For creation of new user or retrieval of existing user' checkins/data
    sendUserData: function (data) {
      if(data) {
        return $http({
          method: 'POST',
          data: data,
          url: '/api/users/userdata'
        })
      }
    },

    // Grab existing user's checkins/data
    getUserData: function (userFbID) {
      if (userFbID) {
        return $http({
          method: 'GET',
          url: '/api/users/' + userFbID
        });
      }
    }
  }; 
};

UserRequests.$inject = ['$http'];

//Start creating Angular module
angular.module('waddle.services.userRequestsFactory', [])  
  .factory('UserRequests', UserRequests);
