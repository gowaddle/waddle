var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {

    var userData = req.body;

    User.createOrFind(userData)
    .then(function(user) {
      user.setProperty('fbToken', userData.fbToken);
      user.save();
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }
}

module.exports = userController;