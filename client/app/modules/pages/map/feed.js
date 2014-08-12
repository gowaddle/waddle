angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests) {
    console.log(UserRequests.allData)
  	$scope.allUserCheckinsFeed = {
      get: function(index, count, success) {
      	  //var results = UserRequests.allData.data.allCheckins;
          var results = $scope.data.currentCheckins;
          console.log(results)
          success(results);
      }
    };

    $scope.clickCheckin = function (checkin){
      var data = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkin
      }
       UserRequests.addToBucketList(data)
    }

  });
