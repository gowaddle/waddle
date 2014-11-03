var https = require('https');
var qs = require('querystring');

var Q = require('q');
var _ = require('lodash');

var uuid = require('node-uuid');

var helpers = require('./helpers.js');

var User = require('../api/users/userModel.js');

var utils = {};

//FOURSQUARE HELPER METHODS

utils.exchangeFoursquareUserCodeForToken = function (fsqCode) {
  var deferred = Q.defer();

  var query = {
    client_id: process.env.WADDLE_FOURSQUARE_CLIENT_ID,
    client_secret: process.env.WADDLE_FOURSQUARE_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://waddle.herokuapp.com/fsqredirect',
    code: fsqCode
  };

  var queryPath = 'https://foursquare.com/oauth2/access_token?' + qs.stringify(query);

  helpers.httpsGet(queryPath)
    .then(function (data) {
      deferred.resolve(JSON.parse(data));
    })
    .catch(function (e) {
      deferred.reject(e);
    });
  
  return deferred.promise; 
};

utils.getUserFoursquareIDFromToken = function (user) {

  var deferred = Q.defer();

  var fsqAccessToken = user.getProperty('fsqToken');
  var query = {
    v: '20140806',
    oauth_token: fsqAccessToken
  }
  var queryPath = 'https://api.foursquare.com/v2/users/self?' + qs.stringify(query);

  helpers.httpsGet(queryPath)
    .then(function (data) {
      deferred.resolve(JSON.parse(data));
    })
    .catch(function (e) {
      deferred.reject(e);
    });

  return deferred.promise;
};

utils.tabThroughFoursquareCheckinHistory = function (user) {
  var deferred = Q.defer();

  var fsqAccessToken = user.getProperty('fsqToken');

  var offset = 0;

  utils.getFoursquareCheckinHistory(fsqAccessToken, offset)
  .then(function(checkinHistory) {

    var checkinCount = checkinHistory.response.checkins.count;
    var historyBucketContainer = [Q(checkinHistory)];
    offset += 250;

    while(offset < checkinCount) {
      historyBucketContainer.push(utils.getFoursquareCheckinHistory(fsqAccessToken, offset));
      offset += 250;  
    }

    console.log("hist bucket container", historyBucketContainer.length)

    deferred.resolve(Q.all(historyBucketContainer));
  });

  return deferred.promise;
};

utils.getFoursquareCheckinHistory = function (userAccessToken, offset) {
  var deferred = Q.defer();

  var query = {
    v: '20140806',
    limit: '250',
    offset: offset.toString(),
    oauth_token: userAccessToken
  };

  var queryPath = 'https://api.foursquare.com/v2/users/self/checkins?' + qs.stringify(query);

  helpers.httpsGet(queryPath)
    .then(function (data) {
      deferred.resolve(JSON.parse(data));
    })
    .catch(function (e) {
      deferred.reject(e);
    });

  return deferred.promise;
};

utils.convertFoursquareHistoryToSingleArrayOfCheckins = function (foursquareCheckinHistoryBucketContainer) {
  var allCheckins =  _.map(foursquareCheckinHistoryBucketContainer, function(checkinBucket) {
    return checkinBucket.response.checkins.items;
  });
  
  return _.flatten(allCheckins, true);
};

utils.parseFoursquareCheckins = function(foursquareCheckinArray) {
  return _.map(foursquareCheckinArray, function(checkin) {
    return utils.parseCheckin(checkin);
  });
};

utils.parseNativeCheckin = function (venue) {

  var formattedCheckin = {
    'checkinID': uuid.v4(),
    'name': venue.name,
    'lat': venue.location.lat,
    'lng': venue.location.lng,
    'checkinTime': new Date().getTime(),
    'likes': 'null',
    'photoSmall': 'null',
    'photoLarge': 'null',
    'caption': 'null',
    'foursquareID': venue.id,
    'country': venue.location.country,
    'category': 'null',
    'source': 'waddle'
  };
 

  if (venue.categories[0]) {
    formattedCheckin.category = venue.categories[0].name;
  }

   if (venue.footprintCaption) {
    formattedCheckin.caption = venue.footprintCaption;
  }

  return formattedCheckin;
}

utils.parseCheckin = function (checkin) {
  var formattedCheckin = {
    'checkinID': checkin.id,
    'name': checkin.venue.name,
    'lat': checkin.venue.location.lat,
    'lng': checkin.venue.location.lng,
    'checkinTime': new Date(checkin.createdAt*1000),
    'likes': 'null',
    'photoSmall': 'null',
    'photoLarge': 'null',
    'caption': 'null',
    'foursquareID': checkin.venue.id,
    'country': checkin.venue.location.country,
    'category': 'null',
    'source': 'foursquare'
  };

  if (checkin.venue.categories[0]) {
    formattedCheckin.category = checkin.venue.categories[0].name;
  }

  if (checkin.photos && checkin.photos.count > 0) {
    formattedCheckin.photoSmall = checkin.photos.items[0].prefix + 'cap300' + checkin.photos.items[0].suffix;
    formattedCheckin.photoLarge = checkin.photos.items[0].prefix + 'original' + checkin.photos.items[0].suffix;
  }
  if (checkin.shout) {
    formattedCheckin.caption = checkin.shout;
  }

  return formattedCheckin;
};

utils.generateFoursquarePlaceID = function (user, name, latlng) {
  var deferred = Q.defer();

  var query = {
    v: '20140806',
    limit: '1',
    ll: latlng,
    query: name
  };

  var oauthToken = user.getProperty('fsqToken');

  if (oauthToken) {
    query.oauth_token = oauthToken;
  } else {
    query.client_id = process.env.WADDLE_FOURSQUARE_CLIENT_ID;
    query.client_secret = process.env.WADDLE_FOURSQUARE_CLIENT_SECRET;
  }

  var queryPath = 'https://api.foursquare.com/v2/venues/search?' + qs.stringify(query);

  helpers.httpsGet(queryPath)
    .then(function (data) {
      var venue = JSON.parse(data).response.venues[0];
      if (venue) {
        deferred.resolve(venue.id);
      } else {
        deferred.resolve(name);
      }
    })
    .catch(function (e) {
      deferred.reject(e);
    });


  return deferred.promise;
};

module.exports = utils;
