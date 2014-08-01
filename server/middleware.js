var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

module.exports = function (app, express) {
	var userRouter = express.Router();

	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(express.static(path.join(__dirname, '../client')));

	app.use('api/users', userRouter);
	require('./api/users/userRoutes.js')(userRouter);

};
