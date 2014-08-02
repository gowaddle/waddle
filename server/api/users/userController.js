var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {
    console.log(req.body);
    var userData = req.body;

    User.create(userData)
    .then(function(node) {
      console.log('successful user creation!!!!');
      console.log(node.node._data.data);
      res.status(204).end();
    })
    .catch(function(err) {
      console.log(err);
      res.status(500).end();
    });
  }
}

module.exports = userController;