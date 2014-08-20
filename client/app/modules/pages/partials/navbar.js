angular.module('waddle.navbar', [])

.controller('NavbarController', function ($scope, Auth) {
	  $scope.logout = Auth.logout;
});