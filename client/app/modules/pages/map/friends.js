FriendsController = function ($scope, $state, UserRequests) {

  $scope.allUserFriends = UserRequests.allData.data.friends;

  $scope.clickFriend = function (friend){
    UserRequests.getUserData(friend)
    .then(function(data){
      console.log(data)
      $scope.handleUserCheckinData(data.data)
      $state.go('map.feed')
    });
  };
  
};

FriendsController.$inject = ['$scope', '$state', 'UserRequests'];

angular.module('waddle.friends', [])
  .controller('FriendsController', FriendsController);
