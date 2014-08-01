var User = require('./userModel.js');

var userController = {
  updateUser: function (req, res) {
    console.log(req.body.data);
    var userData = req.body.data;

    User.create(userData).then(function(user) {
      console.log('successful user creation!!!!');
      console.log(user);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

module.exports = userController;