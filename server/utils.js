var https = require('https');
var qs = require('querystring');
var Q = require('q');

var utils = {};


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
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.exchangeFoursquareUserCode = function (fsqCode) {
  var deferred = Q.defer();
  var queryPath = 'https://foursquare.com/oauth2/access_token
    ?client_id=' + process.env.WADDLE_FOURSQUARE_CLIENT_ID +
    '&client_secret=' + process.env.WADDLE_FOURSQUARE_CLIENT_SECRET +
    '&grant_type=authorization_code
    &redirect_uri=http://localhost:8080/#/map' +
    '&code=' + fsqCode;

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function() {
      deferred.resolve(qs.parse(data));
    })
  })
  .on('error', function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

utils.getFBTaggedPlaces = function (user) {
  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');
  
  var deferred = Q.defer();

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/tagged_places?' + qs.stringify(query);

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

utils.getFBPictureInfo = function (user) {
  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var deferred = Q.defer();

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/'+fbID+'/photos?' + qs.stringify(query);


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

utils.integrateFBPhotosAndCheckins = function (photoData, checkinData) {
  return photoData.concat(checkinData);
};

module.exports = utils;