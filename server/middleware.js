var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var errorhandlers = require('./errorhandlers.js');

module.exports = function (app, express) {
	var userRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));

  app.use('/api/users', userRouter);
  app.use(errorhandlers.errorLogger);
  app.use(errorhandlers.errorHandler);

	require('./api/users/userRoutes.js')(userRouter);
};

module.exports = function (app, express) {
	var checkinRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../client')));

  app.use('/api/checkins', checkinRouter);
  app.use(errorhandlers.errorLogger);
  app.use(errorhandlers.errorHandler);

	require('./api/checkins/checkinRoutes.js')(checkinRouter);
};
