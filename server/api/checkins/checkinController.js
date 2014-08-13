var Checkin = require('./checkinModel.js');
var User = require('../users/userModel.js');
var foursquareUtils = require('../../utils/foursquareUtils.js');

var checkinController = {};

// checkinController.userCheckinData = function (req, res){
//   var data = req.body;

//   Checkin.doStuff()
//   .then(function (data) {
//     console.log(data);
//     res.status(204).end();
//   })
// }

checkinController.realtimeFoursquareData = function (req, res) {
  var checkin = JSON.parse(req.body.checkin);
  var userFoursquareID = checkin.user.id;
  var user;

  User.findByFoursquareID(userFoursquareID)
  .then(function (userNode) {
    user = userNode;
    return foursquareUtils.parseCheckin(checkin);
  })
  .then(function (parsedCheckin) {
    return user.addCheckins([parsedCheckin]);
  })
  .then(function (data) {
    console.log(data);
    res.status(202).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  });
};

checkinController.addToBucketList = function (req, res){
  var checkinID = req.body.checkinID;
  var facebookID = req.body.facebookID;
  Checkin.addToBucketList(facebookID, checkinID)
  .then(function (data){
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  });
}

checkinController.addComment = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;
  var text = req.body.text;

  Checkin.addComment(clickerID, checkinID, text)
  .then(function (data){
    console.log(data);
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).end();
  })
};

checkinController.giveProps = function (req, res){
  var clickerID = req.body.clickerID;
  var checkinID = req.body.checkinID;

  Checkin.giveProps(clickerID, checkinID)
  .then(function (data){
    console.log(data)
    res.json(data);
    res.status(201).end();
  })
  .catch(function (err){
    console.log(err);
    res.status(500).end();
  })
}

module.exports = checkinController;