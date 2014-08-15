var Place = require('./placeModel.js');

var placeController = {};

placeController.updatePlace = function (req, res){

  var placeData = req.body;

  Place.create(placeData)
  .then(function(node) {
    res.status(204).end();
  })
  .catch(function(err) {
    console.log(err);
    res.status(500).end();
  });
};

module.exports = placeController;