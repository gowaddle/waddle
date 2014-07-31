'use strict';
var angular = require('angular');

angular.module('waddle', [
	require('./controllers.js'),
	require('./directives.js'),
	'ui.router'
])

.run()

.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
	$stateProvider
  .state('frontpage', {
  		url: '/',
  		templateUrl: 'pages/frontpage/frontpage.html',
  		controller: 'FrontpageController'
  	});

  $urlRouterProvider.otherwise('/');

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
});