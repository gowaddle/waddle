var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase(process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');

var Place = function(node){
  this.node = node;
}

Place.prototype.getName= function(){
  return this.node.data['name'];
};

Place.prototype.setName= function(name){
  this.node.data['name'] = name;
};

Place.prototype.save = function (){
  var deferred = Q.defer();

  this.node.save(function (err, node){
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(node);
    }
  });

  return deferred.promise();
};

Place.create = function(data){
  node = db.createNode(data);
  var place = new Place(node);

  var query = [
    'MERGE (place:Place {name: {name}, xcoord: {xcoord}, ycoord: {ycoord}})',
    'RETURN place',
  ].join('\n');

  var params = data;

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var place = new Place(results[0]['place']);
      deferred.resolve(user);
    }
  });

  return deferred.promise()
}