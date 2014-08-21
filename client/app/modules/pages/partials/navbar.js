(function(){

var NavbarController = function (Auth, $scope){
  $scope.logout = Auth.logout;
}

angular.module('waddle.navbar', [])

.controller('NavbarController', NavbarController);

})();