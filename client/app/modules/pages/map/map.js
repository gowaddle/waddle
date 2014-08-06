angular.module('waddle.map', [])
  .controller('MapController', function ($scope, $state, $q, Auth, FacebookMapData, Geocoder) {
    Auth.checkLogin()
    .then(function(){

      $scope.logout = Auth.logout;

    	L.mapbox.accessToken = 'pk.eyJ1Ijoid2FkZGxldXNlciIsImEiOiItQWlwaU5JIn0.mTIpotbZXv5KVgP4pkcYrA';

    	var configuredMap = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
        attributionControl: false,
        zoomControl: false,
        worldCopyJump: true
      }).setView([37.6, -122.45], 3);

      var shadedCountries = L.mapbox.featureLayer().addTo(configuredMap);
      var aggregatedMarkers = new L.MarkerClusterGroup({showCoverageOnHover: false});
    	// var facebookPlaces = L.layerGroup().addTo(configuredMap);
      configuredMap.addLayer(aggregatedMarkers);
    
    	var makeMarker = function (placeName, latLng) {
        var marker = L.marker(latLng, {
  	      icon: L.mapbox.marker.icon({
            'marker-color': '1087bf',
            'marker-size': 'large',
            'marker-symbol': 'circle-stroked'
          })
  	    })
  	    .bindPopup('<h2>' + placeName + '</h2>')
  	    // .addTo(facebookPlaces);

        aggregatedMarkers.addLayer(marker);
      };
    	console.log(configuredMap.getZoom());

      var handleFacebookData = function (fbData) {
      	var deferred = $q.defer();
      	var checkinLatLngs = []
		  	$scope.fbData = fbData;
		  	console.log(fbData);
		  	for(var i = 0; i < fbData.length; i++) {
          var checkin = fbData[i].place;
          var checkinLatLng = [checkin.location.latitude, checkin.location.longitude];
          checkinLatLngs.push(checkinLatLng);
          makeMarker(checkin.name, checkinLatLng);
        }
       deferred.resolve(checkinLatLngs);
       return deferred.promise;
      };

    	// $scope.countriesBeen = ["United States", "China"];

     //  var findCountriesBeen = function (fbData) {
     //  	var deferred = $q.defer();
     //  	deferredPromises = [];
     //  	$scope.countriesBeen = [];
     //  	for(var j = 0; j < fbData.length; j++) {
	    //   	var deferred = $q.defer();
     //  		var checkin = fbData[j].place;
	    //   	Geocoder.reverseGeocode(checkin.location.longitude, checkin.location.latitude)
     //        .then(function(data) {
     //        	var countryName = data.data.features[0].place_name;
	    //       	if($scope.countriesBeen.indexOf(countryName) === -1) {
	    //       		$scope.countriesBeen.push(countryName);
	    //       	}
	    //       	deferred.resolve($scope.countriesBeen);
     //        })
     //      .then(function(data) {
	    //   	  deferred.resolve($scope.countriesBeen);
	    //   	  return deferred.promise;
     //      })
     //  	}
     //  };

      // var addToShadedCountries = function () {
	     //  for(var j = 0; j < $scope.countriesBeen.length; j++) {
	     //    for(var i = 0; i < globalCountryData.features.length; i++){
	     //    var boundaries = globalCountryData.features[i].geometry.coordinates;
		    //     if(globalCountryData.features[i].properties['NAME'] == $scope.countriesBeen[j]) {
		    //       if(globalCountryData.features[i].geometry.type == 'MultiPolygon') {
      //           console.log('hi');
		    //         L.multiPolygon(boundaries, {stroke: false, opacity: 0.7, weight: 10, color:'#000', fillColor: '#000', fillOpacity: 0.7}).addTo(shadedCountries);
		    //       }
		    //       else {
		    //         L.polygon(boundaries, {stroke: false, fillColor: '#000'}).addTo(shadedCountries);
		    //       }
		    //     }
	     //    }
	     //  }
      // }
      // addToShadedCountries();

   


      FacebookMapData.getFacebookMapData()
      .then(function(data){
        handleFacebookData(data.data)
		  });
  	    
	  });


  });


