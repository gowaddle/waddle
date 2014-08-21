angular.module('waddle.navbar', [])

.controller('NavbarController', function ($scope, Auth, UserRequests) {
	  $scope.photo = UserRequests.allData.fbProfilePicture;
	  $scope.name = UserRequests.allData.name;
	  $scope.logout = Auth.logout;
});