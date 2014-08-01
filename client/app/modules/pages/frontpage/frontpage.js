angular.module('waddle.frontpage', [])

.controller('FrontpageController', function($scope, $state) {

  openFB.getLoginStatus(function(response){
  	if (response.status === 'connected'){
  	  console.log('connected')
  	} else {
  	  $scope.login = function(){
  	  	openFB.login(function(response){
  	  	  if (response.status === 'connected'){
  	  	  	console.log('connected')
  	  	  }
  	  	}, {scope: 'user_friends'});
  	  }
  	}
  })

});