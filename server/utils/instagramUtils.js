var request = require('request');
var qs = require('querystring');

var Q = require('q');

var utils = {};

utils.exchangeIGUserCodeForToken = function (igCode) {
  var deferred = Q.defer();

  var query = {
    client_id: process.env.WADDLE_INSTAGRAM_CLIENT_ID,
    client_secret: process.env.WADDLE_INSTAGRAM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:8080/instagramredirect',
    code: igCode
  };
  
  var options = {
    url: 'https://api.instagram.com',
    path: '/oauth/access_token',
    method: 'POST',
    json: true,
    form: query
  };

  request(options, function(err, res, body) {
    if (err) { deferred.reject(err); }
    else {
      deferred.resolve(body);
    }
  });

  return deferred.promise;
};

module.exports = utils;
