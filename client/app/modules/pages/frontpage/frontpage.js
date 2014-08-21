var FrontpageController = function (UserRequests, $scope, $state, $rootScope){
  var enterSiteWhenConnected = function (fbToken) {
    openFB.api({
      path: '/me',
      success: function (fbData) {
        sendUserDataToServer(fbToken, fbData);
      },
      error: function(err) { console.log(err); }
    });
  };
  
  var sendUserDataToServer = function(fbToken, fbData){
    window.sessionStorage.userFbID = fbData.id;

    var userData = {
      facebookID: fbData.id,
      name: fbData.name,
      fbToken: fbToken
    };

    $state.go('loading');

    UserRequests.sendUserData(userData)
    .then(function(storedUserData){
      UserRequests.allData = storedUserData.data
      $state.go('map');
    });
  };

  openFB.getLoginStatus(function (response){
    if (response.status === 'connected'){
      console.log('connected');
      enterSiteWhenConnected(response.authResponse.token);
    } else {
      console.log('not connected')
    }
  });

  $scope.login = function(){
    openFB.login(function (response) {
      if(response.status === 'connected') {
        console.log('connected');
        enterSiteWhenConnected(response.authResponse.token);
      } else {
        alert('Facebook login failed: ' + response.error);
      }
    }, {
      scope: 'user_friends, user_tagged_places, user_photos, read_stream'
    });
  };
}

FrontpageController.$inject = ['UserRequests', '$scope', '$state', '$rootScope']

//Start creating Angular module
angular.module('waddle.frontpage', [])
  .controller('FrontpageController', FrontpageController);