angular.module('waddle.navbar', [])

.controller('NavbarController', function ($scope, $state, Auth) {

	  $scope.logout = Auth.logout;

    $scope.goToProvidersPage = function () {
      $state.go('providers');
    };

});