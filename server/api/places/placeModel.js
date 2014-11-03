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

Place.findByCheckinID = function (checkinID) {

  var deferred = Q.defer();

  var query = [
    'MATCH (checkin:Checkin {checkinID: {checkinID}})-[]->(place:Place)',
    'RETURN place',
  ].join('\n');

  var params = {
    checkinID: checkinID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      console.log('results' + JSON.stringify(results[0].user.data))
      if (results && results[0] && results[0]['place']) {
        console.log(results)
        deferred.resolve(new User(results[0]['place']));
      }
      else {
        deferred.reject(new Error('user does not exist'));
      }
    }
  });

  return deferred.promise;
};

module.exports = Place;
