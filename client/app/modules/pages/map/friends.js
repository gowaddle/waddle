(function(){

var FriendsController = function ($scope, $state, UserRequests, MapFactory) {

  if(UserRequests.allData) {
    $scope.allUserFriends = UserRequests.allData.friends;
    console.log($scope.allUserFriends);
  }
//when the location map for a friend is request , this method get the data of the friend and builds the quadtree representing friend data on the map 
  $scope.clickFriend = function (friend) {
    var viewer = window.sessionStorage.userFbID;
    UserRequests.getUserData(friend, viewer)
      .then(function (data){
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(data.data);
        $state.go('map.feed')
      });
  };
};

//Injects all the dependencies needed by FriendController
FriendsController.$inject = ['$scope', '$state', 'UserRequests', 'MapFactory'];

//Creates module waddle.friends and registers the controller function to it 
angular.module('waddle.friends', [])
  .controller('FriendsController', FriendsController);

})();
