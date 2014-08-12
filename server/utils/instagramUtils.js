var request = require('request');
var https = require('https');
var qs = require('querystring');

var Q = require('q');

var utils = {};

utils.exchangeIGUserCodeForToken = function (igCode) {
  var deferred = Q.defer();
  console.log(igCode);

  var query = {
    client_id: process.env.WADDLE_INSTAGRAM_CLIENT_ID,
    client_secret: process.env.WADDLE_INSTAGRAM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: 'http://localhost:8080/instagramredirect',
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
