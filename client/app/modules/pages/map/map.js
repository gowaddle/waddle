angular.module('waddle.map', [])
  .controller('MapController', function ($scope, $state, $stateParams, $q, Auth, UserRequests, $rootScope) {
    
    //an alternative to reloading the entire view
/*    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      if (toState.name === 'map' && fromState.name !=='map'){
        var current = $state.current;
        var params = angular.copy($stateParams)
        $state.transitionTo(current, params, { reload: true, inherit: true, notify: true });
      }
    });*/

    $scope.data = {};

    UserRequests.getUserData(window.sessionStorage.userFbID);
    console.log($scope.data)
    
    Auth.checkLogin()
    .then(function(){

      $state.go('map.feed')

      L.mapbox.accessToken = 'pk.eyJ1Ijoid2FkZGxldXNlciIsImEiOiItQWlwaU5JIn0.mTIpotbZXv5KVgP4pkcYrA';

      var configuredMap = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
        attributionControl: false,
        zoomControl: false,
        worldCopyJump: true,
        minZoom: 2,
        bounceAtZoomLimits: false
      }).setView([20.00, 0.00], 2);

      var shadedCountries = L.mapbox.featureLayer().addTo(configuredMap);
      // var placeMarkers = L.mapbox.featureLayer().addTo(configuredMap);
      var aggregatedMarkers = new L.MarkerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 12, maxClusterRadius: 60});

    // configuredMap.on('move', function() {
    // // Construct an empty list to fill with onscreen markers.
    //   // var inBounds = [],
    //   // // Get the map bounds - the top-left and bottom-right locations.
    //       var bounds = configuredMap.getBounds();

    //   // For each marker, consider whether it is currently visible by comparing
    //   // with the current map bounds.
    //   aggregatedMarkers.eachLayer(function(marker) {
    //       if (bounds.contains(marker.getLatLng())) {
    //           console.log(marker.getLatLng());
    //       }
    //   });

    // // // Display a list of markers.
    // //   document.getElementById('coordinates').innerHTML = inBounds.join('\n');
    // });

      // var facebookPlaces = L.layerGroup().addTo(configuredMap);
    
      var makeMarker = function (placeName, latLng) {
        var args = Array.prototype.slice.call(arguments, 2);
        var img = args[0];
        var marker = L.marker(latLng, {
          icon: L.mapbox.marker.icon({
            'marker-color': '1087bf',
            'marker-size': 'large',
            'marker-symbol': 'circle-stroked'
          }),
          title: placeName
        })

        if(img) {
          console.log(img);
          marker.bindPopup('<h3>' + placeName + '</h3><img src="' + img + '"/>');
        }
        else {
          marker.bindPopup('<h3>' + placeName + '</h3>');
        }
        aggregatedMarkers.addLayer(marker);
      };

      // var makeMarkerTemplate = function (placeName, latLng, checkinTime) {
      //   var markerTemplate = {
      //     type: 'Feature',
      //     'geometry': {
      //       'type': 'Point',
      //       'coordinates': latLng
      //     },
      //     'properties': {
      //       'marker-color': '1087bf',
      //       'marker-size': 'large',
      //       'marker-symbol': 'circle-stroked',
      //       'placeName': placeName,
      //       'checkinTime': checkinTime 
      //     } 
      //   }
      //   return markerTemplate;
      // }

      // var buildGeoJSON = function(checkinData) {
      //   var markerFeatures = [];
      //   for(var i = 0; i < checkinData.length; i++) {

      //   }
      // }

      $scope.handleUserCheckinData = function (allUserCheckins) {
        aggregatedMarkers.clearLayers();
        var deferred = $q.defer();
        var placeLatLngs = [];
        var markers = [];

        $scope.data.currentCheckins = allUserCheckins;
        // $scope.allUserCheckins = allUserCheckins;
        console.log(allUserCheckins);
        for(var i = 0; i < allUserCheckins.length; i++) {
          var place = allUserCheckins[i].place;
          var checkin = allUserCheckins[i].checkin;
          var placeLatLng = [place.lat, place.lng];
          placeLatLngs.push(placeLatLng);
          if(checkin.photoSmall !=='null') {
            console.log(checkin.photoSmall);
            makeMarker(place.name, placeLatLng, checkin.photoSmall);
          }
          else {
            makeMarker(place.name, placeLatLng);
          }
          // markers.push(makeMarkerTemplate(place.name, placeLatLng, checkin.checkinTime));
        }
        // placeMarkers.setGeoJSON({
        //   type: 'FeatureCollection',
        //   features: markers
        // });
        // console.log(placeMarkers);

        deferred.resolve(placeLatLngs);
        return deferred.promise;
      };

      configuredMap.addLayer(aggregatedMarkers);
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

   
         if(UserRequests.allData !== undefined) {
           $scope.data.allData = UserRequests.allData.data;
           $scope.data.friends = UserRequests.allData.data.friends; 
           $scope.handleUserCheckinData(UserRequests.allData.data.allCheckins);
         } else {
          $state.go('frontpage')
         }
    //   FacebookMapData.getFacebookMapData()
    //   .then(function(data){
    //     handleFacebookData(data.data)
      // });
    
  	    
	  });


  });


