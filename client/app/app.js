var angular = require('angular');
angular.module('waddle', [
	'waddle.controllers',
	'waddle.directives'
])

.run()

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  	.state('frontpage', {
  		url: '/',
  		templateUrl: 'pages/frontpage/frontpage.html'
  		controller: 'FrontpageController'
  	});

  $urlProvider.otherwise('/')
})