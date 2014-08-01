angular.module('waddle.frontpage', [])

.controller('FrontpageController', function ($scope, $state, $window, UserRequests) {

  openFB.getLoginStatus(function(response){
  	if (response.status === 'connected'){
  	  console.log('connected');
      $state.go('map');
  	} else {
  	  console.log('not connected')
  	  $scope.login = function(){
  	  	openFB.login(function(response){
          if(response.status === 'connected') {
            openFB.api({path: '/me', success: function(data){
              console.log("data: ", data)
              UserRequests.sendUserData({data:data});

              // do we need these?
              window.localStorage.setItem('FBuserID', data.id);
              window.localStorage.setItem('FBuserName', data.name);
              window.localStorage.setItem('FBuserLocale', data.locale);

              $state.go('map');
            }, error: function(err) {console.log(err);}});
          } else {
            alert('Facebook login failed: ' + response.error);
          }
  	  	}, {scope: 'user_friends, user_tagged_places'});
  	  }
  	}
  })

});