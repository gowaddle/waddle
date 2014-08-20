FriendsController = function ($scope, $state, UserRequests) {
  $scope.clickFriend = function (friend){
    UserRequests.getUserData(friend)
    .then(function(data){
      console.log(data)
      $scope.handleUserCheckinData(data.data)
      $state.go('map.feed')
    });
  };

  $scope.allUserFriends = UserRequests.allData.data.friends;
};

FriendsController.$inject = ['$scope', '$state', 'UserRequests'];

angular.module('waddle.friends', [])
  .controller('FriendsController', FriendsController);
  