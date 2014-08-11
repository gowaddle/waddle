var userController = require('./userController.js');

module.exports = function(app){
  app.post('/userdata', userController.userLogin);
  app.post('/userfoursquarecode', userController.addFoursquareData);
	app.get('/:user', userController.getUserData);
};