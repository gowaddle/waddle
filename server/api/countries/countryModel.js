/*var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');

var Country = function(node){
  this.node = node;
}

Country.create = function(data){
  node = db.createNode(data);
  var country = new Country(node);

  var query = [
    'MERGE (country:Country {name: {name}})',
    'RETURN country',
  ].join('\n');

  var params = data;

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var country = new Country(results[0]['country']);
      deferred.resolve(user);
    }
  });

  return deferred.promise()
}*/

//probably just import csv or json