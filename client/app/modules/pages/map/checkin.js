(function(){

var CheckinController = function ($scope, NativeCheckin){
	$scope.venues = null;


	$scope.venueData = {};

	$scope.passSelectedVenueInfoToPostModal = function (venueInfo) {
		$scope.venue = venueInfo;
	}

	$scope.sendSelectedVenueInfotoServer = function(venueInfo) {
		venueInfo.facebookID = window.sessionStorage.userFbID;

		NativeCheckin.sendCheckinDataToServer(venueInfo)
		.then(function (data) {
			console.log(data);
		})

	}

	$scope.getAndParseUserInput = function () {
		// console.log($scope.venueQuery)
		// console.log($scope.locationQuery)
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