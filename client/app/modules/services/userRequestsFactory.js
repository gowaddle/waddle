angular.module('waddle.services.userRequestsFactory', [])  

.factory('UserRequests', function ($http) {
  var data;
  var footprintData;

  return {
    allData: data,
    currentFootprint: footprintData,

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
    },

    addToBucketList: function (data) {
      if (data) {
        return $http({
          method: 'POST',
          data: data,
          url: '/api/checkins/bucketlist'
        });
      }
    },

    addComment: function (data) {
      if (data && data.text) {
        return $http({
          method: 'POST',
          data: data,
          url: '/api/checkins/comment'
        });
      }
    },

    giveProps: function (data) {
      if (data) {
        return $http({
          method: 'POST',
          data: data,
          url: '/api/checkins/props'
        });
      }
    },

    getFootprintInteractions: function (data) {
      if (data) {
        return $http({
          method: 'GET',
          url: '/api/checkins/interactions/' + data
        });
      }
    }
  };
});
