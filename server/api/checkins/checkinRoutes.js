var checkinController = require('./checkinController.js');

module.exports = function (app){
  app.get('/userCheckinData', checkinController.userCheckinData);
  app.post('/realtimefsqdata', checkinController.realtimeCheckinData);
}