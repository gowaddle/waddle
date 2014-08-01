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
    })
    .state('map', {
      url: '/map',
      templateUrl: '../app/modules/pages/map/map.html',
      controller: 'MapController'
    })

  $urlRouterProvider.otherwise('/');

});