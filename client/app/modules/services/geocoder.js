angular.module('waddle.services.geocoder', [])

.factory('Geocoder', function ($http){

	var geocodeQueryBuilder = function(latLngArray) {
		var batchQuery = ''
		for(var i = 0; i < latLngArray.length; i++) {

		}

	}

	var reverseGeocode = function(lat, lng) {
		return $http({
			method: 'GET',
			url: 'http://api.tiles.mapbox.com/v4/geocode/mapbox.places-country-v1/' + lat + ',' + lng + '.json?access_token=' + globals.MAPBOX_ACCESS_TOKEN
		})
	}

	return {
		reverseGeocode: reverseGeocode
	}
});