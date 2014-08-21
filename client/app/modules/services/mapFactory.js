angular.module('waddle.services.mapFactory', [])

.factory('MapFactory', function($q){

  var QuadTree = function (latlng, footprint) {
    this.lat = latlng[0];
    this.lng = latlng[1];
    this.footprint = footprint;
    this.NE = null;
    this.SE = null;
    this.NW = null;
    this.SW = null;
  };

  QuadTree.prototype.insert = function (latlng, footprint) {
    var myLat = latlng[0];
    var myLng = latlng[1];

    if (myLat >= this.lat && myLng >= this.lng) {
      this.NE ? this.NE.insert(latlng, footprint) : this.NE = new QuadTree(latlng, footprint);
    } else if (myLat < this.lat && myLng >= this.lng) {
      this.SE ? this.SE.insert(latlng, footprint) : this.SE = new QuadTree(latlng, footprint);
    } else if (myLat >= this.lat && myLng < this.lng) {
      this.NW ? this.NW.insert(latlng, footprint) : this.NW = new QuadTree(latlng, footprint);
    } else if (myLat < this.lat && myLng < this.lng) {
      this.SW ? this.SW.insert(latlng, footprint) : this.SW = new QuadTree(latlng, footprint);
    }
  };

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

  var markerQuadTree = null;
  var myQuadTree = null;
  
	return {
    QuadTree: QuadTree,
		markerQuadTree: markerQuadTree
	};
});