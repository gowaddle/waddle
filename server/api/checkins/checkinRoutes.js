var checkinController = require('./checkinController.js');

module.exports = function (app) {
  app.post('/realtimefsqdata', checkinController.realtimeFoursquareData);

  app.get('/realtimeinstagram', checkinController.instagramHubChallenge);
  app.post('/realtimeinstagram', checkinController.handleIGPost);

  app.post('/bucketlist', checkinController.addToBucketList);
};
