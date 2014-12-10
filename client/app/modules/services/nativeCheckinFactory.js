(function(){

var NativeCheckin = function ($http, $q){

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
    },

    s3_upload: function() {
        var deferred = $q.defer();
        var status_elem = document.getElementById("status");
        var preview_elem = document.getElementById("preview");
        console.log('status: ' + status_elem + 'preview: ' + preview_elem);

        var s3upload = new S3Upload({
          file_dom_selector: 'files',
          s3_sign_put_url: 'api/checkins/sign_s3',
          onProgress: function(percent, message) {
              status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
          },
          onFinishS3Put: function(public_url) {
              console.log(public_url)
              status_elem.innerHTML = 'Upload completed. Uploaded to: ' + public_url;
              // Store this url in mongodb
              // self.saveStache(newStache);
              preview_elem.innerHTML = '<img src="' + public_url + '" style="height:45px;border: #455059 4px solid;"/>';
              deferred.resolve(public_url);
          },
          onError: function(status) {
              status_elem.innerHTML = 'Upload error: ' + status;
          }
        });
        return deferred.promise;
    }

  }; 
};

NativeCheckin.$inject = ['$http', '$q'];

//Start creating Angular module
angular.module('waddle.services.nativeCheckinFactory', [])  
  .factory('NativeCheckin', NativeCheckin);

})();
