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

User.prototype.setProperties = function(properties) {
  for (var key in properties){
    console.log(key)
    if (properties.hasOwnProperty(key)){
      this.node.data[key] = properties[key]
    }
  }
  console.log(this.node.data)
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

User.prototype.addFriends = function(friendsList){
  var deferred = Q.defer();

  var facebookID = this.getProperty('facebookID');

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'MERGE (friend:User {facebookID: {friendFacebookID}, name: {friendName}})',
    'MERGE (user)-[:hasFriend]->(friend)',
    'MERGE (friend)-[:hasFriend]->(user)',
    //change to merge on foursquareID only
    'RETURN friend',
  ].join('\n');

  //?includeStats=true
  var batchRequest = _.map(friendsList, function (friend, index) {
    var singleRequest = {
      'method': "POST",
      'to': "/cypher?includeStats=true",
      'body': {
        'query': query,
        'params': {
          friendName: friend.name,
          friendFacebookID: friend.id,
          facebookID: facebookID
        }
      },
      'id': index
    };

    return singleRequest;
  });

  var options = {
    'url': neo4jUrl + '/db/data/batch',
    'method': 'POST',
    'json': true,
    'body': JSON.stringify(batchRequest)
  };

  request.post(options, function(err, response, body) {
    if (err) { deferred.reject(err) }
    else {
      console.log(body);
      deferred.resolve(body);
    }
  });

  return deferred.promise;


}

User.prototype.addCheckins = function(combinedCheckins){
  var deferred = Q.defer();
  //need to check for params!
  var facebookID = this.getProperty('facebookID');

/*var query = [
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
    'MERGE (checkin:Checkin {checkinID: {checkinID}})',
    'ON CREATE SET checkin = {checkinID: {checkinID}, likes: {likes}, photoSmall: {photoSmall}, photoLarge: {photoLarge}, caption: {caption}, checkinTime: {checkinTime}, source: {source}}',
    'ON MATCH SET checkin.checkinTime = {checkinTime}, checkin.likes = {likes}, checkin.photoSmall = {photoSmall}, checkin.photoLarge = {photoLarge}, checkin.caption = {caption}, checkin.source = {source}',
    //change to merge on foursquareID only
    'MERGE (place:Place {name: {name}, lat: {lat}, lng: {lng}, country: {country}, category: {category}, foursquareID: {foursquareID}})',
    'MERGE (user)-[:hasCheckin]->(checkin)-[:hasPlace]->(place)',
    'RETURN user, checkin, place',
  ].join('\n');

  var batchRequest = _.map(combinedCheckins, function (checkin, index) {
    var singleRequest = {
      'method': "POST",
      'to': "/cypher",
      'body': {
        'query': query,
        'params': checkin
      },
      'id': index
    };

    singleRequest.body.params.facebookID = facebookID;

    return singleRequest;
  });

  var options = {
    'url': neo4jUrl + '/db/data/batch',
    'method': 'POST',
    'json': true,
    'body': JSON.stringify(batchRequest)
  };

  request.post(options, function(err, response, body) {
    if (err) { deferred.reject(err) }
    else {
      deferred.resolve(body);
    }
  });

  return deferred.promise;
};

User.prototype.findAllFriends = function () {
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})-[:hasFriend]->(friend:User)',
    'RETURN friend',
  ].join('\n');

  var params = {
    facebookID: this.getProperty('facebookID')
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var parsedResults = _.map(results, function (friend) {
        return friend.friend._data.data
      })

      deferred.resolve(parsedResults);
    }
  });

  return deferred.promise;
};

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
    'MERGE (user:User {facebookID: {facebookID}})',
    'SET user.name = {name}',
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

  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'RETURN user',
  ].join('\n');

  var params = data;

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      if (results && results[0] && results[0]['user']) {
        deferred.resolve(new User(results[0]['user']));
      }
      else {
        deferred.reject(new Error('user does not exist'));
      }
    }
  });

  return deferred.promise;
};

User.findByFoursquareID = function (foursquareID) {

  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {foursquareID: {foursquareID}})',
    'RETURN user',
  ].join('\n');

  var params = {
    foursquareID: foursquareID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });

  return deferred.promise;
};

User.findByInstagramID = function (instagramID) {

  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {instagramID: {instagramID}})',
    'RETURN user',
  ].join('\n');

  var params = {
    instagramiD: InstagramID
  };

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