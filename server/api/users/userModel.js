var neo4j = require('neo4j');
var Q = require('q');

var db = new neo4j.GraphDatabase('http://localhost:7474');

var User = function (node){
	this.node = node;
};

User.prototype.id = function(){
	return this.node.id;
};

User.prototype.getName= function(){
	return this.node.data['name'];
};

User.prototype.setName= function(name){
	this.node.data['name'] = name;
};

User.prototype.save = function (){
  var deferred = Q.defer();

	this.node.save(function (err, node){
		if (err) { deferred.reject(err); }
    else {
      deferred.resolve(node);
    }
	});

  return deferred.promise();
};

User.create = function (data) {
  var node = db.createNode(data);
  var user = new User(node);

  var query = [
    'CREATE (user:User {data})',
    'RETURN user',
  ].join('\n');

  var params = {
    data: data
  };

  var deferred = Q.defer();

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var user = new User(results[0]['user']);
      deferred.resolve(user);
    }
  });

  return deferred.promise;
};

User.get = function (id) {
  var deferred = Q.defer();

  db.getNodeById(id, function (err, node) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(node));
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