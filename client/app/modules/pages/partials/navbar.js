(function(){

var NavbarController = function (Auth, $rootScope, $scope, UserRequests, MapFactory, $state){
  $scope.logout = Auth.logout;

  $scope.loadBucketlist = function () {
    UserRequests.getBucketList(window.sessionStorage.userFbID)
      .then(function (BucketData) {
        // Because the navbar controller does not inherit the map or feed scope,
        // current map has to be retrieved from MapFactory.  This is used to set the inbounds 
        // immediately when 'my bucketlist' is clicked
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(BucketData.data);
        var bounds = MapFactory.currentMap.getBounds()
        MapFactory.currentInBounds = MapFactory.markerQuadTree.markersInBounds(bounds._southWest, bounds._northEast);
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
