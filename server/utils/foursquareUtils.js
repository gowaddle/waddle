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

utils.convertFoursquareHistoryToSingleArrayOfCheckins = function (foursquareCheckinHistoryBucketContainer) {
  var allCheckins =  _.map(foursquareCheckinHistoryBucketContainer, function(checkinBucket) {
    return checkinBucket.response.checkins.items;
  });
  return _.flatten(allCheckins, true);
}

utils.parseFoursquareCheckins = function(foursquareCheckinArray) {

 var parsedCheckins = [];
 _.each(foursquareCheckinArray, function(item) {

    var placeCheckin = {
        'name': item.venue.name,
        'lat': item.venue.location.lat,
        'lng': item.venue.location.lng,
        'checkinTime': new Date(item.createdAt*1000),
        'likes': 'null',
        'photos': 'null',
        'caption': 'null',
        'foursquareID': item.venue.id,
        'country': item.venue.location.country,
        'category': 'null'
      };


    if(item.venue.categories[0]) {
      placeCheckin.category = item.venue.categories[0].name;
    }

    // if(item.photos.count > 0) {
    //   placeCheckin.photos = _.map(item.photos.items, function(photo) {
    //     var photoMetaData = {
    //       prefix: photo.prefix,
    //       suffix: photo.suffix,
    //       height: photo.height,
    //       width: photo.width,
    //       visibility: photo.visibility
    //     }
    //     return photoMetaData;
    //   });
    // }
    if(item.shout) {
      placeCheckin.caption = item.shout;
    }
    parsedCheckins.push(placeCheckin);
  });
 return parsedCheckins;
}

module.exports = utils;
