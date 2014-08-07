angular.module('waddle.providers', [])

.controller('ProvidersController', function($scope) {

	//make sure we are writing to the userID in the db that matches user ID in session storage
	//if it matches, then do post request with code to server endpoint users/providers/foursquaredata
	var parseFoursquareCode = function() {
		var url = window.location.href;
		var processedUrl = url.split('code=');
		var userCode = processedUrl[1].split('#');
		return userCode[0];
	}

	var sendFoursquareCodeToServer = function(code) {
		return $http({
			method: 'POST',
			data: {facebookID: window.sessionStorage.facebookID, foursquareCode: code},
			url: 'api/users/foursquarecode'
		})
	}

	// sendFoursquareCodeToServer(parseFoursquareCode());
})