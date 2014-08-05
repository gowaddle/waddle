angular.module('waddle.frontpage', [])

.controller('FrontpageController', function ($scope, $state, UserRequests) {

  var enterSiteWhenConnected = function (fbToken) {
    openFB.api({
      path: '/me',
      success: function (fbData) {
        sendUserDataToServer(fbToken, fbData);
      },
      error: function(err) { console.log(err); }
    });
  };
  
  var sendUserDataToServer = function(fbToken, data){
    var userData = {
      facebookID: data.id,
      name: data.name,
      fbToken: fbToken
    };

    console.log("userDataPassedToServer: ", userData)

    UserRequests.sendUserData(userData)
    .then(function(){
        //$state.go('map') should occur here when we end up getting data from the database (and show a waddling penguin meanwhile)
    });

    $state.go('map');
  };

  openFB.getLoginStatus(function (response){
    if (response.status === 'connected'){
      console.log('connected');
      enterSiteWhenConnected(response.authResponse.token);
    } else {
      console.log('not connected')

  	  $scope.login = function(){
  	  	openFB.login(function (response) {
          if(response.status === 'connected') {
            console.log('connected');
            enterSiteWhenConnected(response.authResponse.token);
          } else {
            alert('Facebook login failed: ' + response.error);
          }
        }, {
          scope: 'user_friends, user_tagged_places'
        });
  	  };
  	}
  })

});