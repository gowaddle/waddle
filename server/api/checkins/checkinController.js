var Checkin = require('./checkinModel.js');

checkinController.userCheckinData = function (req, res){
  var placeData = req.body;

  Place.create(placeData)
  .then(function(node) {
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
}

module.exports = checkinController;