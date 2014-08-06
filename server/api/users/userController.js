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
    //start getting checkin specific data
    .then(function (fbCheckinData) {
      userFBCheckinData = fbCheckinData.data;
      var latitudeLongitude = fbCheckinData.data[0].place.location
      return utils.getFBPictureInfo(user);
    })
    .then(function (fbPhotoData) {
      console.log("currnt")
      console.log(fbPhotoData.data[0])
      userFBPhotoData = fbPhotoData.data;
      return utils.integrateFBPhotosAndCheckins(userFBPhotoData, userFBCheckinData);
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
    console.log(userData);
    User.createOrFind(userData)
      .then(function (userNode) { 
        user = userNode;
        console.log(userNode);
      });
  }


}



module.exports = userController;