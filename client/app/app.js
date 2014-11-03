// The applcations states are created using ui-router . 
//Here the controller,templateURL that each state uses are specified too.

(function(){

'use strict';
var WaddleConfig = function ($stateProvider, $urlRouterProvider) {
  //creates an application state 
  $stateProvider
    .state('frontpage', {
      url: '/',
      templateUrl: '../app/modules/pages/frontpage/frontpage.html',
      controller: 'FrontpageController'
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
    .state('map.providers', {
      url: '/providers',
      templateUrl: '../app/modules/pages/providers/providers.html'
    })
    .state('map.friends', {
      url: '/friends',
      templateUrl: '../app/modules/pages/map/friends.html', 
      controller: 'FriendsController'
    })
    .state('map.feed', {
      url: '/feed',
      views: {
        '': {
          templateUrl: '../app/modules/pages/map/feed.html', 
          controller: 'FeedController as mapFeed'
        },
        'profile': {
          templateUrl: '../app/modules/pages/map/profile.html',
          controller: 'ProfileController'
        }
      },
    })
    .state('map.feed.checkin', {
      url: '/checkin',
      templateUrl: '../app/modules/pages/map/checkin.html',
      controller: 'CheckinController'
    })
    .state('map.feed.checkin.post', {
      url: '/:venue',
      templateUrl: '../app/modules/pages/map/checkinpost.html',
      controller: 'CheckinController'
    })
    .state('map.feed.footprint', {
      url: '/:footprint',
      templateUrl: '../app/modules/pages/map/footprint.html'
    })
    .state('map.footprints', {
      url: '/footprints',
      templateUrl: '../app/modules/pages/map/footprints.html',
      controller: 'FeedController as mapFeed'
    })
//when  none of the above state match the URL then redirect the page to state represented by '/' 
  $urlRouterProvider.otherwise('/');
};

//All the depenedent modules in the app are registered . Through config method application states are configired .
angular.module('waddle', [
  'waddle.controllers',
  'waddle.directives',
  'waddle.services',
  'ui.router',
  'wu.masonry',
  'mgcrea.ngStrap.helpers.dimensions',
  'mgcrea.ngStrap.tooltip',
  'mgcrea.ngStrap.dropdown',
  'ngSanitize',
  'btford.socket-io'
]).config(['$stateProvider', '$urlRouterProvider', WaddleConfig]);

//   angular.module('mgcrea.ngStrap')
//   .config(function($dropdownProvider) {
//     angular.extend($dropdownProvider.defaults, {
//       html: true
//     });
// })

})();