angular.module('waddle.feed', [])
  .controller('FeedController', function ($rootScope, $scope, UserRequests) {
  console.log(UserRequests.allData)
  	$scope.allUserCheckinsFeed = {
    get: function(index, count, success) {
        success(UserRequests.allData.data.allCheckins);
    }
  };
  });
