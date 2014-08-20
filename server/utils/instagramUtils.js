var https = require('https');
var qs = require('querystring');
var User = require('./userModel.js');

var Q = require('q');

var utils = {};

utils.handleUpdate = function (update) {
  var deferred = Q.defer();

  var timestamp = update.time - 1;
  
  var igUserID = update.object_id;
  var user;

  User.findByInstagramID(igUserID)
  .then(function (userNode) {
    user = userNode;
    deferred.resolve(utils.makeRequestForMedia(user, timestamp));
  })
  .catch(function (e) {
    deferred.reject(e);
  })

  return deferred.promise;
};

utils.makeRequestForMedia = function (user, timestamp) {
  var deferred = Q.defer();

  var igUserID = user.getProperty('instagramID');
  var accessToken = user.getProperty('igToken');

  var query = {
    access_token: accessToken,
    min_timestamp: timestamp
  };

  var queryPath = 'https://api.instagram.com/v1/users/'+ igUserID + '/media/recent?' + qs.stringify(query);

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

utils.exchangeIGUserCodeForToken = function (igCode) {
  var deferred = Q.defer();

  var query = {
    client_id: process.env.WADDLE_INSTAGRAM_CLIENT_ID,
    client_secret: process.env.WADDLE_INSTAGRAM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://waddle.herokuapp.com/instagramredirect',
    code: igCode
  };

  var queryPath = qs.stringify(query);
  
  var options = {
    hostname: 'api.instagram.com',
    path: '/oauth/access_token',
    method: 'POST'
  };

  var req = https.request(options, function(res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      deferred.resolve(JSON.parse(data));
    })
  });

  req.on('error', function (e) {
    deferred.reject(e);
  });

  req.write(queryPath);
  req.end();

  return deferred.promise;
};

module.exports = utils;
