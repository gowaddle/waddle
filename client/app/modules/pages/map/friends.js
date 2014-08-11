angular.module('waddle.friends', [])
  .controller('FriendsController', function ($scope, $state, UserRequests) {
      $scope.testing = ['a', 'friend'];
      console.log($scope.testing);

      $scope.clickFriend = function (friend){
        UserRequests.getUserData(friend)
        .then(function(data){
          console.log(data)
          $scope.handleUserCheckinData(data.data)
        });
      }
  });