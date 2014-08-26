var https = require('https');

var Q = require('q');

var helpers = {};

helpers.httpsGet = function (queryPath) {
  var deferred = Q.defer();

  https.get(queryPath, function (res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function(){
      deferred.resolve(data);
    })
  }).on('error', function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = helpers;
