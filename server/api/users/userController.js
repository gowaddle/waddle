var foursquareUtils = require('../../utils/foursquareUtils.js');
var facebookUtils = require('../../utils/facebookUtils.js');
var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {

    var userData = req.body;
    var user;
    var userFBCheckinData;
    var userFBPhotoData;

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
    .then(function (userNode) {
      user = userNode;
      return facebookUtils.getFBTaggedPlaces(user);
    })
    //start getting checkin specific data
    .then(function (fbCheckinData) {
      userFBCheckinData = fbCheckinData.data;
      var latitudeLongitude = fbCheckinData.data[0].place.location
      return facebookUtils.getFBPictureInfo(user);
    })
    .then(function (fbPhotoData) {
      console.log("currnt")
      console.log(fbPhotoData.data[0])
      userFBPhotoData = fbPhotoData.data;
      return facebookUtils.integrateFBPhotosAndCheckins(user, userFBPhotoData, userFBCheckinData);
    })
    .then(function (d) {
      //console.log(d);
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

    User.find(userData)
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