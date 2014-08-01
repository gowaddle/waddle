var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase('http://localhost:7474');

var User = function (node){
	this.node = node;
}

User.prototype.id = function(){
	return this.node.id;
}

User.prototype.getName= function(){
	return this.node.data['name'];
}

User.prototype.setName= function(name){
	this.node.data['name'] = name;
};

User.prototype.save = function (callback){
	this.node.save(function (err){
		callback(err);
	});
};





module.exports = User;