var https = require('https');
var qs = require('querystring');
var Q = require('q');
var _ = require('lodash');

var utils = {};

//FOURSQUARE HELPER METHODS

utils.exchangeFoursquareUserCodeForToken = function (fsqCode) {
  var deferred = Q.defer();

  var query = {
    client_id: process.env.WADDLE_FOURSQUARE_CLIENT_ID,
    client_secret: process.env.WADDLE_FOURSQUARE_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:8080/fsqredirect',
    code: fsqCode
  };

  var queryPath = 'https://foursquare.com/oauth2/access_token?' + qs.stringify(query);

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      console.log(data);
      deferred.resolve(JSON.parse(data));
    })
  }).on('error', function(err) {
    deferred.reject(err);
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

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function(){
      deferred.resolve(JSON.parse(data));
    })
  }).on('error', function(err) {
    deferred.reject(err);
  });
  return deferred.promise;
};

utils.tabThroughFoursquareCheckinHistory = function (user) {
  var deferred = Q.defer();

  var offset = 0;
  var historyBucketContainer = [];

  var fsqAccessToken = user.getProperty('fsqToken');

  utils.getFoursquareCheckinHistory(fsqAccessToken, offset)
  .then(function(checkinHistory) {
    console.log('checkinHistory: ' + checkinHistory);

    var checkinCount = checkinHistory.response.checkins.count;
    console.log('checkinCount: ' + checkinCount);

    var numberOfTimesToTabThroughHistory = Math.ceil(checkinCount/250);

    for(var i = 0; i < numberOfTimesToTabThroughHistory; i++) {
      historyBucketContainer.push(utils.getFoursquareCheckinHistory(fsqAccessToken, offset));
      offset += 250;  
    }
    console.log('historyBucketContainer: ' + historyBucketContainer);
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

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function(){
      deferred.resolve(JSON.parse(data));
    })
  }).on('error', function(err) {
    deferred.reject(err);
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

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function(){
      var venue = JSON.parse(data).response.venues[0];
      if (venue) {
        deferred.resolve(venue.id);
      } else {
        deferred.resolve(name);
      }
    })
  }).on('error', function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = utils;
