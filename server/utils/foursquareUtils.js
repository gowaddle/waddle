var https = require('https');
var qs = require('querystring');
var Q = require('q');

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

utils.getFoursquareCheckinHistory = function (user) {
  var deferred = Q.defer();

  var fsqAccessToken = user.getProperty('fsqToken');
  var queryPath = 'https://api.foursquare.com/v2/users/self/checkins?v=20140806' +
  '&limit=250' +
  '&sort=oldestfirst' +
  '&oauth_token=' + fsqAccessToken;

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function(){
      deferred.resolve(JSON.parse(data));
    })
  }).on('error', function(err) {
    console.log(err);
  });
  return deferred.promise;
};

module.exports = utils;
