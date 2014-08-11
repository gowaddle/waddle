var Checkin = require('./checkinModel.js');

var checkinController = {};

// checkinController.userCheckinData = function (req, res){
//   var data = req.body;

//   Checkin.doStuff()
//   .then(function (data) {
//     console.log(data);
//     res.status(204).end();
//   })
//   .catch(function (err) {
//     console.log(err);
//     res.status(500).end();
//   });
// }

checkinController.realtimeFoursquareData = function (req, res){
  var data = req.body;
  console.log(data);
}

module.exports = checkinController;