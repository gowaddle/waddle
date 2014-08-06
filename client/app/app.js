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
    .state('add_providers', {
      url: '/add_providers',
      templateUrl: '../app/modules/pages/providers/add_providers.html'
    })
    .state('providers', {
      url: '/providers',
      templateUrl: '../app/modules/pages/providers/loading.html',
      controller: 'ProvidersController'
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
          controller: 'FeedController'
        }

      }
    });

  $urlRouterProvider.otherwise('/');

});