(function(){

var MapController = function (Auth, UserRequests, MapFactory, $scope, $state, $stateParams, $rootScope){
      
  // On transition from a friends map to original user map,
  // only the data should change (and reload feed)
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
    if (toState.name === 'map' && fromState.name !== 'map'){
      MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(UserRequests.allData.allCheckins);
      $state.go('map.feed');
    }
  });

  console.log(UserRequests.allData)

  $scope.data = {};
    
  Auth.checkLogin()
  .then(function(){

    $scope.currentMap = MapFactory.initializeMap();

    if(UserRequests.allData) {
      MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(UserRequests.allData.allCheckins);
      $state.go('map.feed');
    } else {
      $state.go('frontpage');
    }
  });
}

MapController.$inject = ['Auth', 'UserRequests', 'MapFactory', '$scope', '$state', '$stateParams', '$rootScope'];

//Start creating Angular module
angular.module('waddle.map', [])
  .controller('MapController', MapController);

})();
