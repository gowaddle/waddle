var https = require('https');
var qs = require('querystring');
var Q = require('q');
var _ = require('lodash');
var foursquareUtils = require('./foursquareUtils');
var User = require('../api/users/userModel.js');

var utils = {};

//FACEBOOK HELPER METHODS

utils.exchangeFBAccessToken = function (fbToken) {
  var deferred = Q.defer();

  var query = {
    grant_type: 'fb_exchange_token',
    client_id: process.env.WADDLE_FACEBOOK_APP_ID,
    client_secret: process.env.WADDLE_FACEBOOK_APP_SECRET,
    fb_exchange_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/oauth/access_token?' + qs.stringify(query);

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      deferred.resolve(qs.parse(data));
      console.log(data);
    });

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.getFBProfilePicture = function (userID) {
  var deferred = Q.defer();

  var queryPath = 'https://graph.facebook.com/' + userID + '/picture?redirect=false&type=large';

  https.get(queryPath, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      deferred.resolve(JSON.parse(data));
    });

  }).on('error', function(e) {
    deferred.reject(e);
  });

  return deferred.promise;
}

utils.getFBFriends = function (user) {
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');
  
  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/friends?' + qs.stringify(query);

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      deferred.resolve(JSON.parse(data));
    });

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.getFBTaggedPosts = function (user) {
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/tagged?' + qs.stringify(query);

  var taggedPostsContainer = [];

  deferred.resolve(utils.makeFBTaggedPostsRequest(queryPath, taggedPostsContainer));

  return deferred.promise;
};

utils.makeFBTaggedPostsRequest = function (queryPath, taggedPostsContainer) {
  var deferred = Q.defer();

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var dataObj = JSON.parse(data);

      taggedPostsContainer.push(dataObj.data)

      if (! dataObj.paging) {
        deferred.resolve(_.flatten(taggedPostsContainer, true));
      } else {
        deferred.resolve(utils.makeFBTaggedPostsRequest(dataObj.paging.next, taggedPostsContainer));
      }
    });

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
}

utils.getFBPhotos = function (user) {
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/photos?' + qs.stringify(query);

  var photoContainer = [];

  deferred.resolve(utils.makeFBPhotosRequest(queryPath, photoContainer));

  return deferred.promise;
};

utils.makeFBPhotosRequest = function (queryPath, photoContainer) {
  var deferred = Q.defer();

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var dataObj = JSON.parse(data);

      photoContainer.push(dataObj.data)

      if (! dataObj.paging) {
        deferred.resolve(_.flatten(photoContainer, true));
      } else {
        deferred.resolve(utils.makeFBPhotosRequest(dataObj.paging.next, photoContainer));
      }
    });

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.getFBStatuses = function (user) {
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/statuses?' + qs.stringify(query);

  var photoContainer = [];

  deferred.resolve(utils.makeFBPhotosRequest(queryPath, photoContainer));

  return deferred.promise;
};

utils.makeFBStatusesRequest = function (queryPath, statusContainer) {
  var deferred = Q.defer();

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var dataObj = JSON.parse(data);

      statusContainer.push(dataObj.data)

      if (! dataObj.paging) {
        deferred.resolve(_.flatten(statusContainer, true));
      } else {
        deferred.resolve(utils.makeFBStatusesRequest(dataObj.paging.next, statusContainer));
      }
    });

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.handleUpdateObject = function (update) {
  console.log("update: " + JSON.stringify(update));
  var deferred = Q.defer();

  var fbUserID = {facebookID: update.uid};
  var fbPostCreatedTime = update.time - 1;
  var user;

  User.find(fbUserID)
  .then(function (userNode) {
    user = userNode;
    return utils.makeRequestForFeedItem(user, fbPostCreatedTime);
  })
  .then(function (fbResponse) {
    var feedItems = fbResponse.data;
    console.log("dis be ma response data: " + JSON.stringify(feedItems));

    var processedFeedItems = [];

    _.each(feedItems, function (feedItem) {
        processedFeedItems.push(utils.parseFBPost(user, feedItem));
    });

  return Q.all(processedFeedItems);
  })
  .catch(function (e) {
    deferred.reject(e);
  })

  return deferred.promise;
};

utils.makeRequestForFeedItem = function (user, postCreatedTime) {
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var query = {
    access_token: fbToken,
    since: postCreatedTime,
    'with': 'location'
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/feed?' + qs.stringify(query);


  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      deferred.resolve(JSON.parse(data));
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.parseFBPost = function (user, data) {
  var deferred = Q.defer();

  console.log("im hurr and dis is ma data: " + JSON.stringify(data));

  var place = {
      'checkinID': data.id,
      'name': data.place.name,
      'lat': data.place.location.latitude,
      'lng': data.place.location.longitude,
      'checkinTime': new Date(data.created_time),
      'likes': 'null',
      'photoSmall': 'null',
      'photoLarge': 'null',
      'caption': 'null',
      'foursquareID': 'null',
      'country': 'null',
      'category': 'null',
      'source': 'facebook'
  }

  if (data.likes) {
    place.likes = data.likes.data.length;
  }

   if (data.updated_time) {
    place.checkinTime = new Date(data.updated_time);
  }

  if(data.message) {
    place.caption = data.message;
  }

  if (data.picture) {
    place.photoSmall = data.picture;
  }

  if (data.source) {
    place.photoLarge = data.source;
  }

  var latlng = place.lat.toString() + ',' + place.lng.toString();
    
  foursquareUtils.generateFoursquarePlaceID(user, place.name, latlng)
  .then(function (foursquareVenueID) {
    place.foursquareID = foursquareVenueID;
    deferred.resolve({
      checkin: place,
      user: user
    });
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

utils.parseFBData = function (user, data) {
  var deferred = Q.defer();

  var parsedData = [];
  var foursquareVenueQueries = [];

  _.each(data, function (datum) {
    if (datum.place) {
      var place = {
        'checkinID': datum.id,
        'name': datum.place.name,
        'lat': datum.place.location.latitude,
        'lng': datum.place.location.longitude,
        'checkinTime': new Date(datum.created_time),
        'likes': 'null',
        'photoSmall': 'null',
        'photoLarge': 'null',
        'caption': 'null',
        'foursquareID': 'null',
        'country': 'null',
        'category': 'null',
        'source': 'facebook'
      }

      if (datum.likes) {
        place.likes = datum.likes.data.length;
      }

       if (datum.updated_time) {
        place.checkinTime = new Date(datum.updated_time);
      }

      if(datum.message) {
        place.caption = datum.message;
      }

      if (datum.picture) {
        place.photoSmall = datum.picture;
      }

      if (datum.source) {
        place.photoLarge = datum.source;
      }

      var latlng = place.lat.toString() + ',' + place.lng.toString();
      
      parsedData.push(place);
      foursquareVenueQueries.push(foursquareUtils.generateFoursquarePlaceID(user, place.name, latlng));
    }
  });

  Q.all(foursquareVenueQueries)
  .then(function (foursquareVenueIDs) {
    _.each(parsedData, function (datum, index) {
      datum.foursquareID = foursquareVenueIDs[index];
    });
    deferred.resolve(parsedData);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = utils;
