var qs = require('querystring');
var request = require('request');

var Q = require('q');
var _ = require('lodash');

var neo4j = require('neo4j');
var neo4jUrl = process.env['WADDLE_GRAPHENEDB_URL'] || 'http://localhost:7474';
var db = new neo4j.GraphDatabase(neo4jUrl);

var Checkin = require('../checkins/checkinModel.js');
var Place = require('../places/placeModel.js');

// Class to instantiate different users which will inherit prototype functions
var User = function (node){
	this.node = node;
};

User.prototype.id = function(){
	return this.node.id;
};

// Set a single property on a user and automatically save
User.prototype.setProperty = function(property, value) {
  this.node.data[property] = value;
  return this.save();
};

// Set a batch of properties on a user and automatically save
User.prototype.setProperties = function(properties) {
  for (var key in properties){
    if (properties.hasOwnProperty(key)){
      this.node.data[key] = properties[key]
    }
  }
  return this.save();
};

// Find a specific property on an instantiated user
User.prototype.getProperty = function(property) {
  return this.node.data[property];
};

// S
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

//Primary function to instantiate new users based on facebookID and name
User.createUniqueUser = function (data) {
  var deferred = Q.defer();
  if (!data.facebookID || !data.name){
    deferred.reject(new Error('Requires facebookID and name parameters'))
  }

  var query = [
    'MERGE (user:User {facebookID: {facebookID}})',
    'SET user.name = {name}',
    'RETURN user',
  ].join('\n');

  var params = data;

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });

  return deferred.promise;
};

// Add friends to a user
// Requires a list of friends that are mapped over and placed into batch request body
User.prototype.addFriends = function(friendsList){
  var deferred = Q.defer();

  var facebookID = this.getProperty('facebookID');

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'MERGE (friend:User {facebookID: {friendFacebookID}, name: {friendName}})',
    'MERGE (user)-[:hasFriend]->(friend)',
    'MERGE (friend)-[:hasFriend]->(user)',
    'RETURN friend',
  ].join('\n');

  // Map over the friends and return a list of objects
  // ?includeStats=true will give back data added to the db
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

  // Batch requests with request library
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
}

// Add checkins to a user
// Requires a list of checkins that are mapped over and placed into batch request body
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

  // Map over the friends and return a list of objects
  // 'to' can be modified with ?includeStats=true to give back data added to the db
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

// Find all of a user's friends
// Uses this.getProperty to grab instantiated user's facebookID as query parameter
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

// Basic query to find all user's checkins
// Uses this.getProperty to grab instantiated user's facebookID as query parameter
User.prototype.findAllCheckins = function (viewer) {
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})-[:hasCheckin]->(checkin:Checkin)-[:hasPlace]->(place:Place)',
    'OPTIONAL MATCH (checkin)<-[]-(comment:Comment)<-[]-(commenter:User)',
    (viewer ? 'OPTIONAL MATCH (liker:User {facebookID: {viewerID}})-[:givesProps]->(checkin)' +
      'OPTIONAL MATCH (bucketer:User {facebookID: {viewerID}})-[:hasBucket]->(checkin)' : ""),
    'RETURN user, checkin, place, collect(comment), collect(commenter)' + (viewer ? ', liker, bucketer' : "")
  ].join('\n');

  var params = {
    facebookID: this.getProperty('facebookID')
  };
  if (viewer){
    params['viewerID'] = viewer
  }


  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var parsedResults = _.map(results, function (item) {
        
        var singleResult = {
          "user": item.user.data,
          "checkin": item.checkin.data,
          "place": item.place.data,
          "comments": null
        }

        if(item['collect(comment)'].length && item['collect(commenter)'].length) {
          var commentsArray = [];
          for(var i = 0; i < item['collect(comment)'].length; i++) {
            var commentData = {
              comment: item['collect(comment)'][i].data,
              commenter: item['collect(commenter)'][i].data
            }
            commentsArray.push(commentData);
          }
          singleResult.comments = commentsArray;
        }

        if (item.liker){
          singleResult.checkin.liked = true;
        }
        if (item.bucketer){
          singleResult.checkin.bucketed = true;
        }
        return singleResult
      });

      deferred.resolve(parsedResults);
    }
  });

  return deferred.promise;
};

//TO-DO: implement query to get all footprints associated with a user and their friends

// User.getAggregatedFootprintList = function (viewer) {
//   var deferred = Q.defer();

//   var query = [
//     'M'
//   ]
// 

User.prototype.getAggregatedFootprintList = function (facebookID) {
  var deferred = Q.defer();

  var query = [
    // 'MATCH (user:User {facebookID: {facebookID}})-[:hasCheckin]->(checkin:Checkin)-[:hasPlace]->(place:Place)',
    'MATCH (user:User {facebookID: {facebookID}})-[:hasFriend]->(friend:User)-[:hasCheckin]->(checkin:Checkin)-[:hasPlace]->(place:Place)',
    'OPTIONAL MATCH (checkin)<-[]-(comment:Comment)<-[]-(commenter:User)',
    'RETURN user, friend, checkin, place, collect(comment), collect(commenter)'
  ].join('\n');

  var params = {
    facebookID: this.getProperty('facebookID')
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var parsedResults = _.map(results, function (item) {
        var singleResult = {
          "user": item.user.data,
          "checkin": item.checkin.data,
          "place": item.place.data,
        }

        if(item['collect(comment)'].length && item['collect(commenter)'].length) {
          var commentsArray = [];
          for(var i = 0; i < item['collect(comment)'].length; i++) {
            var commentData = {
              comment: item['collect(comment)'][i].data,
              commenter: item['collect(commenter)'][i].data
            }
            commentsArray.push(commentData);
          }
          singleResult.comments = commentsArray;
        }

        if(item.friend) {
          singleResult["user"] = item.friend.data;
        }

        return singleResult;
      });

      deferred.resolve(parsedResults);
    }
  });

  return deferred.promise;
}
// Find all bucketList items for a user
// Takes a facebookID and returns a footprint object with
// checkin and place keys, containing checkin and place data
User.getBucketList = function (facebookID){
  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})-[:hasBucket]->(checkin:Checkin)-[:hasPlace]->(p:Place)',
    'RETURN checkin, p',
  ].join('\n');

  var params = {
    'facebookID': facebookID
  };
  
  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      var parsedResults = _.map(results, function (item) {
        var singleResult = {
          checkin: item.checkin.data,
          place: item.p.data
        }
        singleResult.checkin.bucketed = true;
        if (singleResult.checkin.likes.length){
          singleResult.checkin.liked = true;
        }
        console.log(item.checkin.data)
        return singleResult;
      })

      deferred.resolve(parsedResults);
    }
  });

  return deferred.promise;
}

// Find a single user in the database, requires facebookID as input
// If user is not in database, promise will resolve to error 'user does not exist'
User.find = function (data) {

  console.log('model: ', JSON.stringify(data));

  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {facebookID: {facebookID}})',
    'RETURN user',
  ].join('\n');

  var params = data;

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      console.log('results' + JSON.stringify(results[0].user.data))
      if (results && results[0] && results[0]['user']) {
        console.log(results)
        deferred.resolve(new User(results[0]['user']));
      }
      else {
        deferred.reject(new Error('user does not exist'));
      }
    }
  });

  return deferred.promise;
};

// Find a single user based on foursquareID and return a node 
// to add new foursquare information after resolve
// If user does not have a foursquareID, the promise will resolve to error
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

// Find a single user based on foursquareID and return a node 
// to add new foursquare information after resolve
// If user does not have a foursquareID, the promise will resolve to error
User.findByInstagramID = function (instagramID) {

  var deferred = Q.defer();

  var query = [
    'MATCH (user:User {instagramID: {instagramID}})',
    'RETURN user',
  ].join('\n');

  var params = {
    instagramID: instagramID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });

  return deferred.promise;
};

User.findByFootprintCheckinID = function (checkinID) {
  var deferred = Q.defer();

  var query = [
    'MATCH (checkin:Checkin{checkinID: {checkinID}})<-[]-(user:User)',
    'RETURN user'
  ].join('\n');

  var params = {
    checkinID: checkinID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(new User(results[0]['user']));
    }
  });
  return deferred.promise;
}

User.findLatestCommenterAndCommentOnCheckinByCheckinID = function (checkinID) {
  var deferred = Q.defer();

  var query = [
  'MATCH (user:User)-[]->(checkin:Checkin {checkinID:{checkinID}})<-[]-(comment:Comment)<-[]-(commenter:User)',
  'OPTIONAL MATCH (checkin)-[]->(place:Place)',
  'RETURN user, commenter, checkin, comment, place', 
  'ORDER BY -comment.time', 
  'LIMIT 1'
  ].join('\n');

  var params = {
    checkinID: checkinID
  };

  db.query(query, params, function (err, results) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(results[0]);
    }
  });
  return deferred.promise;
}

module.exports = User;