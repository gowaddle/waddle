'use strict';

angular.module('waddle', [
  'waddle.controllers',
	'waddle.directives',
  'waddle.services',
	'ui.router',
  'ui.scroll',
  'ui.scroll.jqlite'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('frontpage', {
      url: '/',
      templateUrl: '../app/modules/pages/frontpage/frontpage.html',
      controller: 'FrontpageController'
    })
    .state('providers', {
      url: '/providers',
      templateUrl: '../app/modules/pages/providers/providers.html'
    })
    .state('loading', {
      url: '/loading',
      templateUrl: '../app/modules/pages/providers/loading.html'
    })
    .state('map', {
      url: '/map',
      views: {
        '': {
          templateUrl: '../app/modules/pages/map/map.html',
          controller: 'MapController'
        },
        'feed@map': {
          templateUrl: '../app/modules/pages/map/feed.html', 
          controller: 'MapController'
        }

      }
    });

  $urlRouterProvider.otherwise('/');

});