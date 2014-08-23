var https = require('https');
var qs = require('querystring');

var Q = require('q');
var _ = require('lodash');

var helpers = require('./helpers.js');
var foursquareUtils = require('./foursquareUtils.js');

var User = require('../api/users/userModel.js');

var utils = {};

utils.handleUpdateObject = function (update) {
  var deferred = Q.defer();

  var timestamp = update.time - 1;
  
  var igUserID = update.object_id;
  var user;

  User.findByInstagramID(igUserID)
  .then(function (userNode) {
    user = userNode;
    return utils.makeRequestForMedia(user, timestamp);
  })
  .then(function (mediaResp) {
    var media = mediaResp.data;

    var postsWithLocation = [];

    _.each(media, function (photo) {
      if (photo.location && photo.location.name) {
        postsWithLocation.push(utils.parseIGPost(photo, user));
      }
    });

    return Q.all(postsWithLocation);
  })
  .then(function (postArr) {
    deferred.resolve(postArr);
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

  helpers.httpsGet(queryPath)
    .then(function (data) {
      deferred.resolve(JSON.parse(data));
    })
    .catch(function (e) {
      deferred.reject(e);
    });

  return deferred.promise;

  // HANDLE PAGINATION
  // if (postArr.pagination && postArr.pagination.next_url){
  //     console.log("MORE DATA!!")
  //   }
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

utils.parseIGPost = function (post, user) {
  //data[i].location.latitude
  //.data.location.longitude
  //.data.location.name
  //.data.caption.text
  //.data.createdAt
  //.data.[picturessmalllarge]
  //.data.images.thumbnail
  //.data.images.standard_resolution
  //.data.id
  var deferred = Q.defer();

  console.log(post.created_time);
  console.log(parseInt(post.created_time));
  console.log(parseInt(post.created_time)*1000);
  console.log(new Date(parseInt(post.created_time)*1000));


  var checkin = {
    'checkinID': post.id,
    'name': post.location.name,
    'lat': post.location.latitude,
    'lng': post.location.longitude,
    'checkinTime': new Date(parseInt(post.created_time)*1000),
    'likes': 'null',
    'photoSmall': 'null',
    'photoLarge': 'null',
    'caption': 'null',
    'foursquareID': 'null',
    'country': 'null',
    'category': 'null',
    'source': 'instagram'
  };

  if (post.likes) {
    checkin.likes = post.likes.count;
  }

  if(post.caption) {
    checkin.caption = post.caption.text;
  }

  if (post.images) {
    if (post.images.thumbnail){
      checkin.photoSmall = post.images.thumbnail.url;
    }
    if (post.images.standard_resolution){
      checkin.photoLarge = post.images.standard_resolution.url;
    }
  }

  var latlng = checkin.lat.toString() + ',' + checkin.lng.toString();
    
  foursquareUtils.generateFoursquarePlaceID(user, checkin.name, latlng)
  .then(function (foursquareVenueID) {
    checkin.foursquareID = foursquareVenueID;
    deferred.resolve({
      checkin: checkin,
      user: user
    });
  })
  .catch(function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

module.exports = utils;
