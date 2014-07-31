'use strict';

angular.module('waddle', [
  'waddle.controllers',
	'waddle.directives',
	'ui.router'
])

.run()

.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
	$stateProvider
  .state('frontpage', {
  		url: '/',
  		templateUrl: 'pages/frontpage/frontpage.html',
  		controller: 'Ctrl'
  	});

  $urlRouterProvider.otherwise('/');

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file):/);
});