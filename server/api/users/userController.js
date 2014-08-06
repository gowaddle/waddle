var utils = require('../../utils.js');
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
      return utils.exchangeFBAccessToken(userData.fbToken);
    })
    .then(function (fbReqData) {
      return user.setProperty('fbToken', fbReqData.access_token);
    })
    .then(function (userNode) {
      user = userNode;
      return utils.getFBTaggedPlaces(user);
    })
    .then(function (fbCheckinData) {
      userFBCheckinData = fbCheckinData.data;
      return utils.getFBPictureInfo(user);
    })
    .then(function (fbPhotoData) {
      userFBPhotoData = fbPhotoData.data;
      return utils.integrateFBPhotosAndCheckins(userFBPhotoData, userFBCheckinData);
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
      return utils.exchangeFoursquareUserCodeForToken(userData.foursquareCode);
    })
    .then(function (foursquareAccessToken) {
      console.log("the access token is " + JSON.parse(foursquareAccessToken.access_token));
      // return user.setProperty('fsqToken', foursquareAccessToken);
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