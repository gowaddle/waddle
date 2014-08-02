var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {
    console.log(req.body);
    var userData = req.body;

    User.create(userData)
    .then(function(node) {
      console.log('successful user creation!!!!');
      console.log(node.node._data.data);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

module.exports = userController;