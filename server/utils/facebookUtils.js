var https = require('https');
var qs = require('querystring');
var Q = require('q');
var _ = require('lodash');
var foursquareUtils = require('./foursquareUtils');

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
  var deferred = Q.defer();

  var fbID = user.getProperty('facebookID');
  var fbToken = user.getProperty('fbToken');
  
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
    })

  }).on('error', function (e) {
    deferred.reject(e);
  });

  return deferred.promise;
};

utils.parseFBData = function (user, data) {
  var deferred = Q.defer();

  var parsedData = [];
  var foursquareVenueQueries = [];

  _.each(data, function (datum) {
    if (datum.place) {
      var place = {
        'name': datum.place.name,
        'lat': datum.place.location.latitude,
        'lng': datum.place.location.longitude,
        'checkinTime': new Date(datum.created_time),
        'likes': 'null',
        'photos': 'null',
        'caption': 'null',
        'foursquareID': 'null',
        'country': 'null',
        'category': 'null',
        'source': 'facebook'
      }

      if (datum.likes) {
        place.likes = datum.likes.data.length;
      }

      var latlng = place.lat.toString() + ',' + place.lng.toString();
      
      parsedData.push(place);
      foursquareVenueQueries.push(foursquareUtils.generateFoursquarePlaceID(user, place.name, latlng));
    }
  });

  console.log('4s query sample', JSON.stringify(foursquareVenueQueries[0]));

  Q.all(foursquareVenueQueries)
  .then(function (foursquareVenueIDs) {
    _.each(parsedData, function (datum, index) {
      datum.foursquareID = foursquareVenueIDs[index];
    });
    console.log('parsedData sample' + JSON.stringify(parsedData[0]));
    deferred.resolve(parsedData);
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = utils;