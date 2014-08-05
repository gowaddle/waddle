var userController = require('./userController.js');

module.exports = function(app){
  app.post('/userdata', userController.updateUser);
/*	app.get('/:user', userController.getUserData);*/
};