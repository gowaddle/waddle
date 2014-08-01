angular.module('waddle.frontpage', [])

.controller('FrontpageController', function($scope, $state, $window) {

  openFB.getLoginStatus(function(response){
  	if (response.status === 'connected'){
  	  console.log('connected')
  	} else {
  	  console.log('not connected')
  	  $scope.login = function(){
  	  	openFB.login(function(response){
          if(response.status === 'connected') {
            openFB.api({path: '/me', success: function(data){
              window.localStorage.setItem('FBuserID', data.id);
              window.localStorage.setItem('FBuserName', data.name);
              window.localStorage.setItem('FBuserLocale', data.locale);
            }, error: function(err) {console.log(err);}});
          } else {
            alert('Facebook login failed: ' + response.error);
          }
  	  	}, {scope: 'user_friends'});
  	  }
  	}
  })

});