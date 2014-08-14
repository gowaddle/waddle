'use strict';

angular.module('waddle', [
  'waddle.controllers',
	'waddle.directives',
  'waddle.services',
	'ui.router',
  'ui.scroll',
  'ui.scroll.jqlite',
  'wu.masonry'
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
        'navbar': {
          templateUrl: '../app/modules/pages/partials/navbar.html',
          controller: 'NavbarController'
        },
        'map': {
          templateUrl: '../app/modules/pages/map/map.html',
          controller: 'MapController'
        }
      }
    })
    .state('map.friends', {
      url: '/friends',
      templateUrl: '../app/modules/pages/map/friends.html', 
      controller: 'FriendsController'
    })
    .state('map.feed', {
      url: '/feed',
      templateUrl: '../app/modules/pages/map/feed.html', 
      controller: 'FeedController'
    })
    .state('map.footprints', {
      url: '/footprints',
      templateUrl: '../app/modules/pages/map/footprints.html',
      controller: 'FeedController'
    })

  $urlRouterProvider.otherwise('/');

});