/*var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');

var Country = function(node){
  this.node = node;
}

Country.importCSV = function(data){
  node = db.createNode(data);
  var country = new Country(node);

  var query = [
    'LOAD CSV WITH HEADERS FROM "http://docs.neo4j.org/chunked/2.1.3/csv/import/persons.csv" AS csvLine',
    'CREATE (p:Person { id: toInt(csvLine.id), name: csvLine.name })',
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