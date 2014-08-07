var https = require('https');
var qs = require('querystring');
var Q = require('q');
var _ = require('lodash');

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
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};


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

utils.getFBPictures = function (user) {
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
      var paging = dataObj.paging;

      if (! paging) {
        deferred.resolve(_.flatten(photoContainer, true));
      } else {
        deferred.resolve(utils.makeFBPhotosRequest(paging.next, photoContainer));
      }
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.generateCheckinListFromPhotoList = function (user, photoList) {
  var photos = _.map(photoList, function (photo) {
    if (photo.place) {
      return photo;
    } else {
      return null;
    }
  })

  return Q.all(photos);
};

utils.getFBPhotoMetadata = function (user, fbPhoto) {
  console.log(fbPhoto);

  var photoId = fbPhoto.id;

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');

  var deferred = Q.defer();

  var query = {
    access_token: fbToken
  };

  var queryPath = 'https://graph.facebook.com/v2.0/' + photoId + '?' + qs.stringify(query);

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var photoMetadata = JSON.parse(data);
      if (photoMetadata.place) {
        deferred.resolve([fbPhoto, photoMetadata]);
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
  
};

module.exports = utils;