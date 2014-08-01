'use strict';

angular.module('waddle', [
  'waddle.controllers',
	'waddle.directives',
  'waddle.services',
	'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('frontpage', {
      url: '/',
      templateUrl: '../app/modules/pages/frontpage/frontpage.html',
      controller: 'FrontpageController'
    });

  $urlRouterProvider.otherwise('/');

});