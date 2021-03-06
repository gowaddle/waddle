var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');

var Place = function(node){
  this.node = node;
};

Place.prototype.setProperty = function(property, value) {
  this.node.data[property] = value;
  return this.save();
};

Place.prototype.getProperty = function(property) {
  return this.node.data[property];
};

Place.prototype.save = function (){
  var deferred = Q.defer();

  this.node.save(function (err, node){
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(node);
    }
  });

  return deferred.promise;
};

Place.create = function(data){
  node = db.createNode(data);
  var place = new Place(node);

  var query = [
    'MERGE (place:Place foursquareID: {foursquareID}, {name: {name}, lat: {lat}, lng: {lng}, country: {country}})',
    'RETURN place',
  ].join('\n');

  var params = data;

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var place = new Place(results[0]['place']);
      deferred.resolve(place);
    }
  });
}

Place.find = function (data){

  var query = [
    'MATCH (place:Place {foursquareID: {foursquareID}})',
    'RETURN place'
  ].join('\n');
  var params = data;

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var place = new Place(results[0]['place']);
      deferred.resolve(place);
    }
  });

  return deferred.promise;
};

module.exports = Place;
