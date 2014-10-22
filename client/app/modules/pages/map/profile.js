(function(){

var ProfileController = function ($scope, $state){

$scope.username = 'Bob Owen';

$scope.picture = ''

}
// Inject all the depependent services needed by the controller
ProfileController.$inject = ['$scope', '$state'];

//Start creating Angular module
angular.module('waddle.profile', [])
  .controller('ProfileController', ProfileController);

})();
