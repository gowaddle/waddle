(function(){

var NavbarController = function (Auth, $rootScope, $scope, UserRequests, MapFactory, $state){
  $scope.logout = Auth.logout;

  $scope.loadBucketlist = function () {
    UserRequests.getBucketList(window.sessionStorage.userFbID)
      .then(function (BucketData) {
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(BucketData.data);
        $scope.currentMap = MapFactory.currentMap
        var bounds = $scope.currentMap.getBounds();
        $rootScope.inBounds = MapFactory.markerQuadTree.markersInBounds(bounds._southWest, bounds._northEast);
        $state.go('map.feed');
      });
  };
  
  if (UserRequests.allData) {
    $scope.photo = UserRequests.allData.fbProfilePicture;
    $scope.name = UserRequests.allData.name;
  }
}

NavbarController.$inject = ['Auth', '$rootScope', '$scope', 'UserRequests', 'MapFactory', '$state'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();
