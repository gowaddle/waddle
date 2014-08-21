(function(){

var NavbarController = function (Auth, $scope){
  $scope.logout = Auth.logout;
}

NavbarController.$inject = ['Auth', '$scope'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();