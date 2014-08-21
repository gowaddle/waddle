(function(){

var NavbarController = function (Auth, $scope, UserRequests){
  $scope.logout = Auth.logout;
  
  if (UserRequests.allData) {
    $scope.photo = UserRequests.allData.fbProfilePicture;
    $scope.name = UserRequests.allData.name;
  }
}

NavbarController.$inject = ['Auth', '$scope', 'UserRequests'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();
