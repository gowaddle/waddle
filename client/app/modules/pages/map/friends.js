angular.module('waddle.friends', [])
  .controller('FriendsController', function ($scope, $state, UserRequests) {
    var data = {
      facebookID: window.sessionStorage.userFbID,
      checkinID: $scope.data.currentCheckins[0].checkin.checkinID
    }
    UserRequests.addToBucketList(data)

    $scope.clickFriend = function (friend){
      UserRequests.getUserData(friend)
      .then(function(data){
        console.log(data)
        $scope.handleUserCheckinData(data.data)
      });
    }
  });