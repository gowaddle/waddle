var neo4j = require('neo4j');
var Q = require('q');
var qs = require('querystring');
var request = require('request');
var _ = require('lodash');

var neo4jUrl = process.env['WADDLE_GRAPHENEDB_URL'] || 'http://localhost:7474';
var db = new neo4j.GraphDatabase(neo4jUrl);

var Checkin = require('../checkins/checkinModel.js');
var Place = require('../places/placeModel.js');

var User = function (node){
	this.node = node;
};

User.prototype.id = function(){
	return this.node.id;
};

User.prototype.setProperty = function(property, value) {
  this.node.data[property] = value;
  return this.save();
};

User.prototype.getProperty = function(property) {
  return this.node.data[property];
};

User.prototype.save = function (){
  var deferred = Q.defer();

	this.node.save(function (err, node){
		if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(node));
    }
	});

  return deferred.promise;
};

User.prototype.addCheckins = function(facebookID, combinedCheckins){
    var deferred = Q.defer()
    var batchRequest = [];

/*    var query = [
    'MERGE (user:User {facebookID: {facebookID}})',
    'MERGE (user)-[:hasCheckin]->' +
    '(checkin:Checkin {checkinTime: {checkinTime},' +
    'likes: {likes}, photos: {photos}, caption: {caption},' +
    'foursquareID: {foursquareID}})',
    'MERGE (checkin)-[:hasPlace]->' +
    '(place:Place {name: {name}, lat: {lat}, lng: {lng}, country: {country}, category: {category}})',
    'RETURN user, checkin, place',
  ].join('\n');*/

   var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'MERGE (checkin:Checkin {checkinTime: {checkinTime},' +
    'likes: {likes}, photos: {photos}, caption: {caption}})',
    'MERGE (place:Place {name: {name}, lat: {lat}, lng: {lng}, country: {country}, category: {category}, foursquareID: {foursquareID}})',
    'MERGE (user)-[:hasCheckin]->(checkin)-[:hasPlace]->(place)',
    'RETURN user, checkin, place',
  ].join('\n');

  for (var checkin = 0; checkin < combinedCheckins.length; checkin++){
    var singleRequest = {
      'method': "POST",
      'to': "/cypher",
      'body': {
        'query': query,
        'params': combinedCheckins[checkin]
      },
      'id': checkin
    };
    singleRequest.body.params.facebookID = facebookID;
    batchRequest.push(singleRequest);
  }

  console.log('sample batch request: ', batchRequest[0])

  var options = {
    'url': neo4jUrl + '/db/data/batch',
    'method': 'POST',
    'json': true,
    'body': JSON.stringify(batchRequest)
  }

  console.log('batch url: ', options.url)

  request.post(options, function(err, response, body) {
    if (err) {deferred.reject(err)}
    deferred.resolve(body);
  });

  return deferred.promise;
}

User.prototype.findAllCheckins = function () {
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})-[:hasCheckin]->(c:Checkin)-[:hasPlace]->(p:Place)',
    'RETURN c, p',
  ].join('\n');

  var params = {
    facebookID: this.getProperty('facebookID')
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var parsedResults = _.map(results, function (item) {
        return {
          checkin: item.c.data,
          place: item.p.data
        }
      })
      deferred.resolve(parsedResults);
    }
  });

  return deferred.promise;
};

User.createUniqueUser = function (data) {
  var deferred = Q.defer();

  var query = [
    'MERGE (user:User {facebookID: {facebookID}, name: {name}})',
    'RETURN user',
  ].join('\n');

  var params = data;
  //data has a user's facebook ID and name

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });

  return deferred.promise;
};

User.find = function (data) {
  var node = db.createNode(data);

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'RETURN user',
  ].join('\n');

  var params = data;

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });

  return deferred.promise;
};

User.getAll = function () {

  var query = [
    'MATCH (user:User)',
    'RETURN user',
  ].join('\n');

  var deferred = Q.defer();

  db.query(query, null, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var users = results.map(function (result) {
        return new User(result['user']);
      });
      deferred.resolve(users);
    }
  });

  return deferred.promise;
};

module.exports = User;