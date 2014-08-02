angular.module('waddle.map', [])
  .controller('MapController', function ($scope, $state, Auth, FacebookMapData) {

  	L.mapbox.accessToken = globals.MAPBOX_ACCESS_TOKEN;

    $scope.logout = Auth.logout;

  	Auth.checkLogin().then(function(){
	  	$scope.map = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
	      attributionControl: false,
	      zoomControl: false,
	      worldCopyJump: true
	    }).setView([37.6, -122.45], 3);

	  	$scope.facebookPlaces = L.layerGroup().addTo($scope.map);

	   	$scope.getMapData = function() {
			  FacebookMapData.getFacebookMapData().then(function(data){
			  	console.log("we got data:", data)
			  	var fbData = data.data;
			  	for(var i = 0; i < fbData.length; i++) {
			  		var checkin = fbData[i].place;
			  		var checkinLatLng = L.latLng(checkin.location.latitude, checkin.location.longitude);
			  		$scope.makeMarker(checkin.name, checkinLatLng)
			  	}
			  })
	  	};

	    $scope.getMapData();
	  });


  	$scope.makeMarker = function(placeName, latLng) {
      L.marker(latLng, {
	      icon: L.mapbox.marker.icon({
          'marker-color': '1087bf',
          'marker-size': 'large',
          'marker-symbol': 'circle-stroked'
        })
	    })
	    .bindPopup('<h2>' + placeName + '</h2>')
	    .addTo($scope.facebookPlaces);
    };
  });


