var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {

    var userData = req.body;

    User.create(userData)
    .then(function(node) {
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }
}

module.exports = userController;