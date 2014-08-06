var foursquareUtils = require('../../utils/foursquareutils.js');
var facebookUtils = require('../../utils/facebookutils.js');
var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {

    var userData = req.body;
    var user;
    var userFBCheckinData;
    var userFBPhotoData;

    User.createOrFind(userData)
    .then(function (userNode) { 
      user = userNode;
    })
    .then(function () {
      return facebookUtils.exchangeFBAccessToken(userData.fbToken);
    })
    .then(function (fbReqData) {
      return user.setProperty('fbToken', fbReqData.access_token);
    })
    .then(function (userNode) {
      user = userNode;
      return facebookUtils.getFBTaggedPlaces(user);
    })
    .then(function (fbCheckinData) {
      userFBCheckinData = fbCheckinData.data;
      return facebookUtils.getFBPictureInfo(user);
    })
    .then(function (fbPhotoData) {
      userFBPhotoData = fbPhotoData.data;
      return facebookUtils.integrateFBPhotosAndCheckins(user, userFBPhotoData, userFBCheckinData);
    })
    .then(function (d) {
      console.log(d);
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  },

  addFoursquareData: function (req, res) {

    var userData = req.body;
    var user;

    User.createOrFind(userData)
    .then(function (userNode) { 
      console.log("userNode: " + userNode);
      user = userNode;
    })
    .then(function () {
      return foursquareUtils.exchangeFoursquareUserCodeForToken(userData.foursquareCode);
    })
    .then(function (foursquareAccessToken) {
      console.log("the foursquare user access token is " + foursquareAccessToken.access_token);
      return user.setProperty('fsqToken', foursquareAccessToken.access_token);
    })
    .then(function (foursquareAccessToken) {
      return foursquareUtils.getUserFoursquareCheckinHistory
    })
    .then(function (d) {
      console.log("data" + d);
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    })
  }
}

module.exports = userController;