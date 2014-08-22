(function(){

var MapFactory = function (){
  // Stores all of a user's checkins based on latitude and longitude
  // Allows quicker lookup times for which markers are in bounds,
  // which is called every time the map moves
  var QuadTree = function (footprint) {
    this.lat = footprint.place.lat;
    this.lng = footprint.place.lng;
    this.footprint = footprint;
    this.NE = null;
    this.SE = null;
    this.NW = null;
    this.SW = null;
  };

  QuadTree.prototype.insert = function (footprint) {
    var myLat = footprint.place.lat;
    var myLng = footprint.place.lng;

    if (myLat >= this.lat && myLng >= this.lng) {
      this.NE ? this.NE.insert(footprint) : this.NE = new QuadTree(footprint);
    } else if (myLat < this.lat && myLng >= this.lng) {
      this.SE ? this.SE.insert(footprint) : this.SE = new QuadTree(footprint);
    } else if (myLat >= this.lat && myLng < this.lng) {
      this.NW ? this.NW.insert(footprint) : this.NW = new QuadTree(footprint);
    } else if (myLat < this.lat && myLng < this.lng) {
      this.SW ? this.SW.insert(footprint) : this.SW = new QuadTree(footprint);
    }
  };

  // Given the top right and bottom left corners of a user's current view,
  // return an array of all checkins within that view
  QuadTree.prototype.markersInBounds = function (SW, NE) {
    var upperLat = NE.lat;
    var upperLng = NE.lng;
    var lowerLat = SW.lat;
    var lowerLng = SW.lng;

    var res = [];

    var recur = function (node) {

      if (node === null) {
        return;
      }

      if (node.lat >= lowerLat && node.lat <= upperLat && node.lng >= lowerLng && node.lng <= upperLng) {
        res.push(node.footprint);
      }

      if (node.lat >= lowerLat) {
        if (node.lng >= lowerLng) {
          recur(node.SW);
        }
        if (node.lng <= upperLng) {
          recur(node.SE);
        }
      }
      if (node.lat <= upperLat) {
        if (node.lng >= lowerLng) {
          recur(node.NW);
        }
        if (node.lng <= upperLng) {
          recur(node.NE);
        }
      }
    };

    recur(this);

    return res;
  };

  // Markers in bounds are stored on factory to be accessible from any state
  var markerQuadTree = null;

  // Mapbox

  L.mapbox.accessToken = 'pk.eyJ1Ijoid2FkZGxldXNlciIsImEiOiItQWlwaU5JIn0.mTIpotbZXv5KVgP4pkcYrA';

  var aggregatedMarkers = new L.MarkerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 12, maxClusterRadius: 60});

  var initializeMap = function () {
    var configuredMap = L.mapbox.map('map', 'injeyeo2.i9nn801b', {
      attributionControl: false,
      zoomControl: false,
      worldCopyJump: true,
      minZoom: 2,
      // maxBounds: [[80,200],[-80,-200]],
      bounceAtZoomLimits: false
    }).setView([20.00, 0.00], 2);

    configuredMap.addLayer(aggregatedMarkers);

    return configuredMap
  }

  var makeMarker = function (footprint) {
    var place = footprint.place;
    var checkin = footprint.checkin;

    var placeName = place.name;
    var latLng = [place.lat, place.lng];
    var img;
    var caption;

    if (checkin.photoSmall !== 'null') {
      img = checkin.photoSmall;
    }

    if (checkin.caption !== 'null') {
      caption = checkin.caption;
    }

    var marker = L.marker(latLng, {
      icon: L.mapbox.marker.icon({
        'marker-color': '1087bf',
        'marker-size': 'large',
        'marker-symbol': 'circle-stroked'
      }),
      title: placeName
    });

    if (img && caption) {
      marker.bindPopup('<h3>' + placeName + '</h3><h4>' + caption + '</h4><img src="' + img + '"/>');
    } else if (img) {
      marker.bindPopup('<h3>' + placeName + '</h3><img src="' + img + '"/>');
    } else if (caption) {
      marker.bindPopup('<h3>' + placeName + '</h3><h4>' + caption + '</h4>');
    } else {
      marker.bindPopup('<h3>' + placeName + '</h3>');
    }

    aggregatedMarkers.addLayer(marker);
  };

  var handleUserCheckinData = function (allFootprints) {
    aggregatedMarkers.clearLayers();

    var footprintQuadtree;

    _.each(allFootprints, function (footprint) {
      var latLng = [footprint.place.lat, footprint.place.lng];

      footprintQuadtree ? footprintQuadtree.insert(footprint) : footprintQuadtree = new QuadTree(footprint);

      makeMarker(footprint);
    });

    return footprintQuadtree;
  };

  
  return {
    QuadTree: QuadTree,
    markerQuadTree: markerQuadTree,
    leaflet: L,
    initializeMap: initializeMap,
    handleUserCheckinData: handleUserCheckinData
  };

    // var shadedCountries = L.mapbox.featureLayer().addTo(configuredMap);
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

};

MapFactory.$inject = [];

angular.module('waddle.services.mapFactory', [])
  .factory('MapFactory', MapFactory);

})();