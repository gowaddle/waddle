var express = require('express');
var app = express();

require('./middleware.js')(app, express);

var port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log('Listening on port ' + this.address().port);
});