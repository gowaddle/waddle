var checkinController = require('./checkinController.js');

module.exports = function (app) {
  app.post('/nativecheckin', checkinController.handleNativeCheckin);
  app.get('/sign_s3', checkinController.sign_s3);
  app.post('/realtimefsqdata', checkinController.realtimeFoursquareData);
  app.get('/realtimeinstagram', checkinController.instagramHubChallenge);
  app.post('/realtimeinstagram', checkinController.handleIGPost);
  app.get('/realtimefacebook', checkinController.facebookHubChallenge);
  app.post('/realtimefacebook', checkinController.handleFBPost);

  //Routes for user actions
  app.post('/bucketlist', checkinController.addToBucketList);
  app.post('/removebucket', checkinController.removeFromBucketList);
  app.post('/comment', checkinController.addComment);
  app.post('/removecomment', checkinController.removeComment);
  app.post('/props', checkinController.giveProps);
  app.get('/interactions/:checkinid', checkinController.getPropsAndComments);
};
