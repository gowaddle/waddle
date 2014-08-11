angular.module('waddle.feed', [])
  .controller('FeedController', function ($rootScope, $scope) {
	  console.log($rootScope.allUserCheckins);
  	$scope.allUserCheckinsFeed = {
    get: function(index, count, success) {
        success($rootScope.allUserCheckins.data.allCheckins);
    }
  };
  });