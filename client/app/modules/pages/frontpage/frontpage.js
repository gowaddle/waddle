angular.module('waddle.frontpage', [])

.controller('FrontpageController', function ($scope, $state, UserRequests) {
  openFB.getLoginStatus(function (response){
  	if (response.status === 'connected'){
  	  console.log('connected');
      $state.go('map');
  	} else {
  	  console.log('not connected')

      var handleUserData = function(data){
        var userData = {
          facebookID: data.id,
          name: data.name
        };

        console.log("fbData: ", data)
        console.log("userDataPassedToServer: ", userData)

        UserRequests.sendUserData(userData)
        .then(function(){
            //$state.go('map') should occur here when we end up getting data from the database (and show a waddling penguin meanwhile)
        });

        $state.go('map');
      };

      var handleOpenFBLoginResponse = function (response) {
        if(response.status === 'connected') {
          openFB.api({
            path: '/me',
            success: handleUserData,
            error: function(err) { console.log(err); }
          });
        } else {
          alert('Facebook login failed: ' + response.error);
        }
      };

  	  $scope.login = function(){
  	  	openFB.login(handleOpenFBLoginResponse, {
          scope: 'user_friends, user_tagged_places'
        });
  	  };

  	}
  })

});