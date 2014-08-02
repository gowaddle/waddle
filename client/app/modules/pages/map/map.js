angular.module('waddle.map', [])
  .controller('MapController', function ($scope, $state, Auth, FacebookMapData) {
    Auth.checkLogin()
    .then(function(){

      $scope.logout = Auth.logout;

    	L.mapbox.accessToken = globals.MAPBOX_ACCESS_TOKEN;

    	var configuredMap = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
        attributionControl: false,
        zoomControl: false,
        worldCopyJump: true
      }).setView([37.6, -122.45], 3);

    	var facebookPlaces = L.layerGroup().addTo(configuredMap);
    
    	var makeMarker = function (placeName, latLng) {
        L.marker(latLng, {
  	      icon: L.mapbox.marker.icon({
            'marker-color': '1087bf',
            'marker-size': 'large',
            'marker-symbol': 'circle-stroked'
          })
  	    })
  	    .bindPopup('<h2>' + placeName + '</h2>')
  	    .addTo(facebookPlaces);
      };

      var handleFacebookData = function (fbData) {
		  	$scope.fbData = fbData;
        for(var i = 0; i < fbData.length; i++) {
          var checkin = fbData[i].place;
          var checkinLatLng = L.latLng(checkin.location.latitude, checkin.location.longitude);
          makeMarker(checkin.name, checkinLatLng)
        }
      };

      FacebookMapData.getFacebookMapData()
      .then(function(data){
        handleFacebookData(data.data);
		  });
  	    
	  });


  });


