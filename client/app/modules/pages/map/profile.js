(function(){

var ProfileController = function ($scope, $state, UserRequests){


	if(UserRequests.allData) {
		console.log('Profile Controller: ', UserRequests.allData);
		$scope.username = UserRequests.allData.name;
		$scope.picture = UserRequests.allData.fbProfilePicture
		$scope.footprintsCount = UserRequests.allData.footprintsCount;
	}

	$scope.$on('displayFriendInfo', function (event, friendProfileData) {
	  console.log('friendProfileData: ', friendProfileData);
	 	$scope.username = friendProfileData.name;
		$scope.picture = friendProfileData.fbProfilePicture
		$scope.footprintsCount = friendProfileData.footprintsCount;
	});


}
// Inject all the depependent services needed by the controller
ProfileController.$inject = ['$scope', '$state', 'UserRequests'];

//Start creating Angular module
angular.module('waddle.profile', [])
  .controller('ProfileController', ProfileController);

})();
