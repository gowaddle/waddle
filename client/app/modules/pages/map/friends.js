FriendsController = function ($scope, $state, UserRequests){
  $scope.clickFriend = function (friend){
    UserRequests.getUserData(friend)
    .then(function(data){
      console.log(data)
      $scope.handleUserCheckinData(data.data)
      $state.go('map.feed')
    });
  };
  $scope.allUserFriends = {
    get: function(index, count, success) {
        //var results = UserRequests.allData.data.allCheckins;
        var results = UserRequests.allData.data.friends;
        console.log(results)
        success(results);
    }
  };
};

FriendsController.$inject = ['$scope', '$state', 'UserRequests'];

angular.module('waddle.friends', [])
  .controller('FriendsController', FriendsController);