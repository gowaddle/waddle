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

  $scope.data = {};
    
  Auth.checkLogin()
  .then(function(){
    
    if(UserRequests.allData) {
      $scope.currentMap = MapFactory.initializeMap();
      MapFactory.currentMap = $scope.currentMap;
      MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(UserRequests.allData.allCheckins);
      $state.go('map.feed');
    } else {
      $state.go('frontpage');
    }
  });
}

// Inject all the depependent services needed by the controller
MapController.$inject = ['Auth', 'UserRequests', 'MapFactory', '$scope', '$state', '$stateParams', '$rootScope'];

//Start creating Angular module
angular.module('waddle.map', [])
  .controller('MapController', MapController);

})();
