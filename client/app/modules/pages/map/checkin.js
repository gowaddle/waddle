(function(){

var CheckinController = function ($scope, NativeCheckin){
	$scope.venues = null;


	$scope.venueData = {};

	$scope.s3Upload = NativeCheckin.s3_upload;

	$scope.passSelectedVenueInfoToPostModal = function (venueInfo) {
		$scope.venue = venueInfo;
	}

	$scope.sendCheckinDataToServer = function(venueInfo) {
		venueInfo.facebookID = window.sessionStorage.userFbID;
		venueInfo.footprintCaption = $scope.footprintCaption;
		NativeCheckin.s3_upload()
		.then(function (public_url) {
		  venueInfo.photo = public_url;
		  console.log('venueInfo: ' + JSON.stringify(venueInfo));
		  NativeCheckin.sendCheckinDataToServer(venueInfo)
		})
		.then(function (data) {
			console.log(data);
		})
	}

	$scope.getAndParseUserInput = function () {
		var venueQuery = $scope.venueQuery.replace(" ", "%20");
		var locationQuery = $scope.locationQuery.replace(" ", "%20");
		NativeCheckin.searchFoursquareVenues({near: locationQuery, query: venueQuery})
		.then(function (results) {
			console.log(results);
			$scope.venues = results.data.response.venues;
		})
	}
}
// Inject all the depependent services needed by the controller
CheckinController.$inject = ['$scope', 'NativeCheckin'];

//Start creating Angular module
angular.module('waddle.checkin', [])
  .controller('CheckinController', CheckinController);

})();