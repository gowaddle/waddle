var express = require('express');
var app = express();
// var server=require('http').Server(app);
// var io = require('socket.io')(server);

require('./middleware.js')(app, express);


var port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log('Listening on port ' + this.address().port);
});

// io.on('connection', function (socket) {
// 	console.log('socket connected!');
//   socket.emit('news', { hello: 'world' });
//   socket.on('hi', function (data) {
//   	io.emit('hi', data);
//     console.log("server says: " + data);
//   });
// });

module.exports.app = app;