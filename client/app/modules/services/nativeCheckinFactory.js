(function(){

var NativeCheckin = function ($http){

  return {

	  searchFoursquareVenues: function (params) {
      if (params) {
        return $http({
          method: 'GET',
          url: 'https://api.foursquare.com/v2/venues/search?' + 
          'client_id=' + globals.WADDLE_FOURSQUARE_CLIENT_ID + 
          '&client_secret=' + globals.WADDLE_FOURSQUARE_CLIENT_SECRET +
          '&v=20141027' +
          '&near=' + params.near + '&query=' + params.query
        });
      }
    },

    sendCheckinDataToServer: function (checkinData) {
      if (checkinData) {
        return $http({
          method: 'POST',
          data: checkinData,
          url: '/api/checkins/nativecheckin/'
        });
      }
    }

  }; 
};

NativeCheckin.$inject = ['$http'];

//Start creating Angular module
angular.module('waddle.services.nativeCheckinFactory', [])  
  .factory('NativeCheckin', NativeCheckin);

})();
