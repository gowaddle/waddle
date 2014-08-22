(function(){

var MapFactory = function (){
  // Stores all of a user's checkins based on latitude and longitude.
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
  
  return {
    QuadTree: QuadTree,
    markerQuadTree: markerQuadTree
  };
};

MapFactory.$inject = [];

angular.module('waddle.services.mapFactory', [])
  .factory('MapFactory', MapFactory);

})();