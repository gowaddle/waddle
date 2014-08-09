angular.module('waddle.map', [])
  .controller('MapController', function ($scope, $state, $q, Auth, $rootScope) {
    Auth.checkLogin()
    .then(function(){

      $scope.logout = Auth.logout;

      $scope.goToProvidersPage = function () {
        $state.go('providers');
      };

    	L.mapbox.accessToken = 'pk.eyJ1Ijoid2FkZGxldXNlciIsImEiOiItQWlwaU5JIn0.mTIpotbZXv5KVgP4pkcYrA';

    	var configuredMap = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
        attributionControl: false,
        zoomControl: false,
        worldCopyJump: true
      }).setView([37.6, -122.45], 3);

      var shadedCountries = L.mapbox.featureLayer().addTo(configuredMap);
      var aggregatedMarkers = new L.MarkerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 12, maxClusterRadius: 60});
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

      var handleUserCheckinData = function (allUserCheckins) {
      	var deferred = $q.defer();
      	var placeLatLngs = [];
		  	$scope.allUserCheckins = allUserCheckins;
		  	console.log(allUserCheckins.data);
		  	for(var i = 0; i < allUserCheckins.data.length; i++) {
          var place = allUserCheckins.data[i].place;
          var placeLatLng = [place.lat, place.lng];
          placeLatLngs.push(placeLatLng);
          makeMarker(place.name, placeLatLng);
        }
       deferred.resolve(placeLatLngs);
       return deferred.promise;
      };

    	// $scope.countriesBeen = [];

     //  var findCountriesBeen = function (allUserCheckins) {
     //    for(var i = 0; i < allUserCheckins.data.length; i++) {
     //      var place = allUserCheckins.data[i].place;
     //      var country = 
     //      if($scope.countriesBeen.indexOf(country) === -1) {
     //        $scope.countriesBeen.push(country);
     //      }
     //      return $scope.countriesBeen;
     //    }
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

   
         if($rootScope.allUserCheckins) {
           handleUserCheckinData($rootScope.allUserCheckins);
         }
    //   FacebookMapData.getFacebookMapData()
    //   .then(function(data){
    //     handleFacebookData(data.data)
		  // });


  	    
	  });


  });


