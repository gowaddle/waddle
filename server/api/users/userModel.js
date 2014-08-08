var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['WADDLE_GRAPHENEDB_URL'] || 'http://localhost:7474');
var Checkin = require('../checkins/checkinModel.js');

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
  var node = db.createNode(data);

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'MERGE (user)-[:hasCheckin]->(checkin:Checkin {name: {name}})',
    'RETURN user, place',
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
}

User.prototype.findAllCheckins = function () {
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID})-[:hasCheckin]->(c:Checkin)-[:hasPlace]->(p:Place)',
    'RETURN user, c, p',
  ].join('\n');

  var params = {
    facebookID: this.getProperty('facebookID')
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
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