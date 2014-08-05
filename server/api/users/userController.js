var utils = require('../../utils.js');
var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {

    var userData = req.body;
    var user;

    User.createOrFind(userData)
    .then(function(u) { 
      user = u;
    })
    .then(function() {
      return utils.exchangeFBAccessToken(userData.fbToken);
    })
    .then(function(d) {
      user.setProperty('fbToken', d.access_token);
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }
}

module.exports = userController;