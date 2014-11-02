(function(){

var ProfileController = function ($scope, $state, UserRequests){

$scope.username = 'HOOBBY';



$scope.picture = ''


// Inject all the depependent services needed by the controller
ProfileController.$inject = ['$scope', '$state', 'UserRequests'];

//Start creating Angular module
angular.module('waddle.profile', [])
  .controller('ProfileController', ProfileController);

})();
