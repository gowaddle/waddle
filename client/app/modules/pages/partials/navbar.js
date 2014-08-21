(function(){

var NavbarController = function (Auth, $scope, UserRequests){
  $scope.logout = Auth.logout;
  $scope.photo = UserRequests.allData.fbProfilePicture;
  $scope.name = UserRequests.allData.name;

}

angular.module('waddle.navbar', [])


.controller('NavbarController', NavbarController);

})();
