angular.module('waddle.services.serverFactory', [])  

.factory('UserRequests', function($http){
  var data;
  var footprintData;

  return {
    allData: data,
    currentFootprint: footprintData,

    sendUserData: function(data){
      return $http({
        method: 'POST',
        data: data,
        url: '/api/users/userdata'
      })
    },

    getUserData: function(user){
      if (!user){
        return
      }
      return $http({
        method: 'GET',
        url: '/api/users/' + user
      });
    },

    addToBucketList: function(data){
      if (!data){
        return
      }
      return $http({
        method: 'POST',
        data: data,
        url: '/api/checkins/bucketlist'
      });
    },

    addComment: function(data){
      if (data && data.text){
        return $http({
          method: 'POST',
          data: data,
          url: '/api/checkins/comment'
        });
      }
    },

    giveProps: function(data){
      if (!data){
        return;
      }
      return $http({
        method: 'POST',
        data: data,
        url: '/api/checkins/props'
      });
    },

    getFootprintInteractions: function(data){
      if (!data){
        return;
      }
      return $http({
        method: 'GET',
        url: '/api/checkins/interactions/' + data
      });
    }
  };
});
