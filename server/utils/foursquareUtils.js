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
}

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

utils.processFoursquareCheckinHistory = function (foursquareCheckinHistoryBuckets) {
  var allCheckins =  _.map(foursquareCheckinHistoryBuckets, function(checkinBucket) {
    return checkinBucket.response.checkins.items;
  });
  return _.flatten(allCheckins, true);
}

module.exports = utils;
