var express = require('express');
var app = express();
var server=require('http').Server(app);
var io = require('socket.io')(server);
var User = require('./api/users/userModel.js');
var Place = require('./api/places/placeModel.js');

require('./middleware.js')(app, express);


var port = process.env.PORT || 8080;

server.listen(port, function () {
	console.log('Listening on port ' + this.address().port);
});

io.on('connection', function (socket) {
	console.log('socket connected!');

  socket.on('comment posted', function(commentData) {
  	var commenterName, receiverUserID, footprintPlaceName;
  	User.findLatestCommenterAndCommentOnCheckinByCheckinID(commentData.checkinID)
  	.then(function(commentData) {
  		commenterName = commentData.commenter.data.name;
  		footprintPlaceName = commentData.place.data.name;
  		console.log(commenterName + ' left a comment on your footprint at ' + footprintPlaceName);
  	})
  })
});

module.exports.app = app;