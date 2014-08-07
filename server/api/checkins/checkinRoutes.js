var checkinController = require('./checkinController.js');

module.exports = function (app){
  app.post('/userCheckinData', checkinController.userCheckinData)
}