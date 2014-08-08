var foursquareUtils = require('../../utils/foursquareUtils.js');
var facebookUtils = require('../../utils/facebookUtils.js');
var User = require('./userModel.js');
var Place = require('../places/placeModel.js');
var Checkin = require('../checkins/checkinModel.js');

var userController = {};

userController.updateUser = function (req, res) {

  var userData = req.body;
  var user;
  var userFBCheckinData = [];
  var userFBPhotoData = [];
  var combinedFBCheckins;
  var alreadyExists = false;


  User.createUniqueUser(userData)
  .then(function (userNode) { 
    user = userNode;
  })
  .then(function () {
    return facebookUtils.exchangeFBAccessToken(userData.fbToken);
  })
  .then(function (fbReqData) {
    return user.setProperty('fbToken', fbReqData.access_token);
  })
  // start getting data for checkins and photos
  .then(function (userNode) {
    user = userNode;
    return facebookUtils.getFBTaggedPlaces(user);
  })
  .then(function (fbRawCheckinData) {
    // parse Checkin data
    facebookUtils.parseFBData(userFBCheckinData, fbRawCheckinData.data);
    // get Picture data
    return facebookUtils.getFBPhotos(user);
  })
  .then(function (fbRawPhotoList) {
    // parse Photo data
    facebookUtils.parseFBData(userFBPhotoData, fbRawPhotoList); 
    // merge checkins and photos
    combinedFBCheckins = userFBCheckinData.concat(userFBPhotoData)
    return user.addCheckins(userData.facebookID, combinedFBCheckins);
  })
  .then(function (data) {
    console.log('fb: ',data);
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
};

userController.addFoursquareData = function (req, res) {

  var userData = req.body;
  var user;

  User.find(userData)
  .then(function (userNode) { 
    // console.log("userNode: " + userNode);
    user = userNode;
  })
  .then(function () {
    return foursquareUtils.exchangeFoursquareUserCodeForToken(userData.foursquareCode);
  })
  .then(function (foursquareAccessToken) {
    // console.log("the foursquare user access token is " + foursquareAccessToken.access_token);
    return user.setProperty('fsqToken', foursquareAccessToken.access_token);
  })
  .then(function (userNode) {
    user = userNode;
    return foursquareUtils.tabThroughFoursquareCheckinHistory(user);
  })
  .then(function (foursquareHistoryBucket) {
    var allFoursquareCheckins = foursquareUtils.convertFoursquareHistoryToSingleArrayOfCheckins(foursquareHistoryBucket);
    var allParsedFoursquareCheckins = foursquareUtils.parseFoursquareCheckins(allFoursquareCheckins);
    return user.addCheckins(userData.facebookID, allParsedFoursquareCheckins);
  })
  .then(function (data) {
    console.log('4s: ',data);
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  })
};

module.exports = userController;