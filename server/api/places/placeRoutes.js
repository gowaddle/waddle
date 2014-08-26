var placeController = require('./placeController.js');

module.exports = function (app){
  app.post('/placedata', placeController.update)
}