(function(){

var NavbarController = function (Auth, $scope, UserRequests){
  $scope.logout = Auth.logout;

  $scope.loadBucket = function () {
    UserRequests.getBucketList(window.sessionStorage.userFbID)
      .then(function (data){
        MapFactory.markerQuadTree = $scope.handleUserCheckinData(data.data);
        $state.go('map.feed')
      });
  };
  
  if (UserRequests.allData) {
    $scope.photo = UserRequests.allData.fbProfilePicture;
    $scope.name = UserRequests.allData.name;
  }
}

NavbarController.$inject = ['Auth', '$scope', 'UserRequests'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();
