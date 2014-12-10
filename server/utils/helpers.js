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

helpers.findCityByReverseGeocoding = function (lat, lng) {
  var deferred = Q.defer();
  var geocodingQueryPath = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places-city-v1/' 
  + lng + ',' + lat + '.json?access_token=pk.eyJ1Ijoid2FkZGxldXNlciIsImEiOiItQWlwaU5JIn0.mTIpotbZXv5KVgP4pkcYrA';
  console.log(geocodingQueryPath);

  helpers.httpsGet(geocodingQueryPath)
  .then(function (data) {
    console.log(data)
    deferred.resolve(JSON.parse(data))
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise
}

module.exports = helpers;
