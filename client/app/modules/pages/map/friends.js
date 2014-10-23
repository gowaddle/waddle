(function(){

var FriendsController = function ($scope, $state, UserRequests, MapFactory, $rootScope) {

  if(UserRequests.allData) {
    $scope.allUserFriends = UserRequests.allData.friends;
  }

  //sets profile info; if friend data not provided, defaults to logged in user's profile

//gets friend data and builds quadtree representing friend data on the map 
  $scope.clickFriend = function (friend) {
    var viewer = window.sessionStorage.userFbID;
    UserRequests.getUserData(friend, viewer)
      .then(function (data){
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(data.data.footprints);
        $state.go('map.feed')
      });
  };
};

//Injects all the dependencies needed by FriendController
FriendsController.$inject = ['$scope', '$state', 'UserRequests', 'MapFactory', '$rootScope'];

//Creates module waddle.friends and registers the controller function to it 
angular.module('waddle.friends', [])
  .controller('FriendsController', FriendsController);

})();
