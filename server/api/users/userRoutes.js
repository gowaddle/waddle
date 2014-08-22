var userController = require('./userController.js');

module.exports = function(app){
  app.post('/userdata', userController.userLogin);
  app.post('/userfoursquarecode', userController.addFoursquareData);
  app.post('/userinstagramcode', userController.addInstagramData);
	app.get('/:friend', userController.getUserData);
  app.get('/bucketlist/:user', userController.getBucketList)
};