var https = require('https');
var qs = require('querystring');
var Q = require('q');

var utils = {};

//FOURSQUARE HELPER METHODS

utils.exchangeFoursquareUserCodeForToken = function (fsqCode) {
  var deferred = Q.defer();
  var queryPath = 'https://foursquare.com/oauth2/access_token' +
    '?client_id=' + process.env.WADDLE_FOURSQUARE_CLIENT_ID +
    '&client_secret=' + process.env.WADDLE_FOURSQUARE_CLIENT_SECRET +
    '&grant_type=authorization_code' +
    '&redirect_uri=http://localhost:8080/fsqredirect' +
    '&code=' + fsqCode;

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

utils.getFoursquareCheckinHistory = function (fsqAccessToken) {
  var deferred = Q.defer();
};

module.exports = utils;
