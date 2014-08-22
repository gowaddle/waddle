(function(){

var FootprintRequests = function ($http){
  var footprintData;
  var openFootprint;

  return {
    // Contains comments and props
    currentFootprint: footprintData,
    // Contains all open footprint data
    openFootprint: openFootprint,

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

    getFootprintInteractions: function (checkinID) {
      if (checkinID) {
        return $http({
          method: 'GET',
          url: '/api/checkins/interactions/' + checkinID
        });
      }
    }
  };
};

FootprintRequests.$inject = ['$http'];

angular.module('waddle.services.footprintRequestsFactory', []) 
  .factory('FootprintRequests', FootprintRequests);

})();