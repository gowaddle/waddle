var checkinController = require('./checkinController.js');

module.exports = function (app) {
  app.post('/realtimefsqdata', checkinController.realtimeFoursquareData);
  app.post('/bucketlist', checkinController.addToBucketList);
};
