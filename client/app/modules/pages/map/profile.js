(function(){

var ProfileController = function ($scope, $state, UserRequests){

$scope.username = 'HOOBBY';

$scope.picture = ''

	$scope.floozy = function () {
	console.log(window.sessionStorage.userFbID);
	UserRequests.getUserInfo(window.sessionStorage.userFbID)
	  .then(function (data) {
		  console.log(data);
	  })
	}


}


// Inject all the depependent services needed by the controller
ProfileController.$inject = ['$scope', '$state', 'UserRequests'];

//Start creating Angular module
angular.module('waddle.profile', [])
  .controller('ProfileController', ProfileController);

})();
