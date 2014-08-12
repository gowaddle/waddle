var neo4j = require('neo4j');
var Q = require('q');
var _ = require('lodash');

var db = new neo4j.GraphDatabase(process.env['WADDLE_GRAPHENEDB_URL'] || 'http://localhost:7474');

var Checkin = function(node){
  this.node = node;
}

Checkin.prototype.setProperty = function(property, value) {
  this.node.data[property] = value;
  return this.save();
};

Checkin.prototype.getProperty = function(property) {
  return this.node.data[property];
};

Checkin.prototype.save = function (){
  var deferred = Q.defer();

  this.node.save(function (err, node){
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new Checkin(node));
    }
  });

  return deferred.promise;
};

Checkin.addToBucketList = function(facebookID, checkinID){
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'MATCH (checkin:Checkin {checkinID: {checkinID}}',
    'MERGE (user)-[:hasBucket]->(checkin)',
    'RETURN checkin',
  ].join('\n');

  var params = {
    facebookID: facebookID,
    checkin: checkinID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(results);
    }
  });

  return deferred.promise;
}

module.exports = Checkin;