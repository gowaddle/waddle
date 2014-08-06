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
  var queryPath = 'https://foursquare.com/oauth2/access_token' +
    '?client_id=' + process.env.WADDLE_FOURSQUARE_CLIENT_ID +
    '&client_secret=' + process.env.WADDLE_FOURSQUARE_CLIENT_SECRET +
    '&grant_type=authorization_code' +
    '&redirect_uri=http://localhost:8080/#/providers' +
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

utils.getFBPhotoMetadata = function (user, fbPhotoId) {
  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var deferred = Q.defer();

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/v2.0/' + fbPhotoId + '?' + qs.stringify(query);

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var photoMetadata = JSON.parse(data);
      if (photoMetadata.place) {
        deferred.resolve(photoMetadata);
      } else {
        deferred.resolve(null);
      }
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
}

utils.integrateFBPhotosAndCheckins = function (user, photoData, checkinData) {
  var photos = [];
  for(var i = 0, photo; photo = photoData[i]; i++) {
    var photoId = photo.id;
    photos.push(utils.getFBPhotoMetadata(user, photoId));
  }
  return Q.all(photos);
};

module.exports = utils;