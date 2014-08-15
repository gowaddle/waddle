var foursquareUtils = require('../../utils/foursquareUtils.js');
var facebookUtils = require('../../utils/facebookUtils.js');
var instagramUtils = require('../../utils/instagramUtils.js');
var User = require('./userModel.js');
var Place = require('../places/placeModel.js');
var Checkin = require('../checkins/checkinModel.js');
var _ = require('lodash');

var userController = {};

userController.userLogin = function (req, res) {

  var userData = req.body;
  var user;
  var userFBTaggedPostsData = [];
  var userFBPhotoData = [];
  var userFBStatusesData = [];
  var userFBFriendsData;
  var combinedFBCheckins;
  var alreadyExists = false;

  User.createUniqueUser(userData)
  .then(function (userNode) { 
    //note: this has the user node
    //console.dir(userNode.node._data.data)
    user = userNode;
    return facebookUtils.exchangeFBAccessToken(userData.fbToken);
  })
  .then(function (fbReqData) {
    return user.setProperty('fbToken', fbReqData.access_token);
  })
  .then(function (userNode) {
    user = userNode;
    return facebookUtils.getFBProfilePicture(userData.facebookID);
  })
  .then(function (fbPicData) {
    if(fbPicData.data.is_silhouette === false) {
      return user.setProperty('fbProfilePicture', fbPicData.data.url); 
    }
  })
  .then(function (userNode) { 
    user = userNode;
    return user.findAllCheckins()
  })
  .then(function (checkinsAlreadyStored) {
    // console.log('fb checkins: ', checkinsAlreadyStored.length);
    if (checkinsAlreadyStored.length) {
      user.findAllFriends()
      .then(function (neoUserData){
        var allData = {
          allCheckins: checkinsAlreadyStored,
          friends: neoUserData,
          fbProfilePicture: user.getProperty('fbProfilePicture')
        }
        res.json(allData);
        res.status(200).end();
      })
    } else {
      getAndParseFBData();
    }
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });

  var getAndParseFBData = function () {
    // start getting data for checkins and photos

    facebookUtils.getFBFriends(user)
    .then(function (fbRawUserData) {
      // Friends data
      console.log(fbRawUserData);
      return user.addFriends(fbRawUserData.data);
    })
    .then(function (friends) {
      // Parse Friends data
      var allFriends = _.map(friends, function(friend){
        return friend.body.data[0][0].data;
      })
      userFBFriendsData = allFriends;

      //get tagged places
      return facebookUtils.getFBTaggedPosts(user);
    })
    .then(function (fbRawTaggedPostsData) {
      // parse Checkin data
      console.log(fbRawTaggedPostsData);
      return facebookUtils.parseFBData(user, fbRawTaggedPostsData);
    })
    .then(function (fbParsedTaggedPostsData) {
      userFBTaggedPostsData = fbParsedTaggedPostsData;
      // get Picture data
      return facebookUtils.getFBPhotos(user);
    })
    .then(function (fbRawPhotoList) {
      // parse Photo data
      // console.log("# of photos", fbRawPhotoList.length)
      return facebookUtils.parseFBData(user, fbRawPhotoList); 
    })
    .then(function (fbParsedPhotoData) {
      // merge tagged places and photos
      userFBPhotoData = fbParsedPhotoData;
      combinedFBCheckins = userFBTaggedPostsData.concat(userFBPhotoData);
      //get statuses posted by user
      return facebookUtils.getFBStatuses(user);
    })
    .then(function (fbRawStatusList) {
      return facebookUtils.parseFBData(user, fbRawStatusList);
    })
    .then(function (fbParsedStatusesData) {
      userFBStatusesData = fbParsedStatusesData;
      combinedFBCheckins = combinedFBCheckins.concat(userFBStatusesData);
      console.log("combinedCheckins: " + combinedFBCheckins);
      return user.addCheckins(combinedFBCheckins);
    })
    .then(function (data) {
      return user.findAllCheckins();
    })
    .then(function (checkinsStored) {
      // console.log('fb checkins: ', checkinsStored.length);
      var allData = {
        allCheckins: checkinsStored,
        friends: userFBFriendsData
      };
      res.json(allData);
      res.status(200).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }
};

userController.addFoursquareData = function (req, res) {

  var userData = req.body;
  var user;

  User.find(userData)
  .then(function (userNode) { 
    // console.log("userNode: " + userNode);
    user = userNode;
    return foursquareUtils.exchangeFoursquareUserCodeForToken(userData.foursquareCode);
  })
  .then(function (foursquareAccessToken) {
    // console.log("the foursquare user access token is " + foursquareAccessToken.access_token);
    return user.setProperty('fsqToken', foursquareAccessToken.access_token);
  })
  .then(function (userNode) {
    user = userNode;
    return foursquareUtils.getUserFoursquareIDFromToken(user);
  })
  .then(function (userFoursquareData) {
    console.log(userFoursquareData.response.user.id);
    return user.setProperty('foursquareID', userFoursquareData.response.user.id);
  })
  .then(function (userNode) {
    user = userNode;
    return foursquareUtils.tabThroughFoursquareCheckinHistory(user);
  })
  .then(function (foursquareHistoryBucket) {
    var allFoursquareCheckins = foursquareUtils.convertFoursquareHistoryToSingleArrayOfCheckins(foursquareHistoryBucket);
    var allParsedFoursquareCheckins = foursquareUtils.parseFoursquareCheckins(allFoursquareCheckins);
    return user.addCheckins(allParsedFoursquareCheckins);
  })
  .then(function (data) {
    // console.log('4s: ', data);
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  })
};

userController.addInstagramData = function (req, res) {

  var userData = req.body;
  var user;
  var igUserData;

  User.find(userData)
  .then(function (userNode) { 
    user = userNode;
    return instagramUtils.exchangeIGUserCodeForToken(userData.instagramCode);
  })
  .then(function (igData) {
    igUserData = igData;
    return user.setProperty('igToken', igUserData.access_token);
  })
  .then(function (userNode) { 
    user = userNode;
    return user.setProperty('instagramID', igUserData.user.id);
  })
  .then(function (userNode) { 
    user = userNode;
    return 'done';
  })
  .then(function (data) {
    console.log('ig: ', data);
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  })

};

userController.getUserData = function(req, res){
  var userData = {
    facebookID: req.params.friend
  };

  User.find(userData)
  .then(function(friend){
    return friend.findAllCheckins();
  })
  .then(function(checkins){
    // console.log("checkins: ", checkins.length)
    res.json(checkins);
    res.status(200).end();
  })
  .catch(function(err){
    console.log(err);
    res.status(500).end();
  });
};

module.exports = userController;