(function(){

var NavbarController = function (Auth, $rootScope, $scope, UserRequests, MapFactory, $state, $dropdown, FootprintRequests){
  $scope.logout = Auth.logout;

  $scope.loadBucketlist = function () {
    UserRequests.getBucketList(window.sessionStorage.userFbID)
      .then(function (BucketData) {
        console.log(BucketData);
        // Because the navbar controller does not inherit the map or feed scope,
        // current map has to be retrieved from MapFactory.  This is used to set the inbounds 
        // immediately when 'my bucketlist' is clicked
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(BucketData.data);
        var bounds = MapFactory.currentMap.getBounds()
        MapFactory.filterFeedByBounds(bounds)
        $state.go('map.feed');
      });
  };
  
  if (UserRequests.allData) {
    $scope.photo = UserRequests.allData.fbProfilePicture;
    $scope.name = UserRequests.allData.name;
  }

  $scope.loadAggregatedFootprints = function () {
    UserRequests.getAggregatedFeedData(window.sessionStorage.userFbID)
      .then(function (aggregatedFootprints) {
        console.log(aggregatedFootprints.data);
        MapFactory.markerQuadTree = MapFactory.handleUserCheckinData(aggregatedFootprints.data);
        var bounds = MapFactory.currentMap.getBounds();
        MapFactory.filterFeedByBounds(bounds);
        $state.go('map.feed'); 
    });
  };

  $scope.loadFootprint = function (notification) {
    console.log(notification);
    $scope.$root.$broadcast("displayFootprint", notification);
    // $scope.footprint = {checkin: notification.checkin, place: notification.place};
    // var checkinID = notification.checkin.checkinID;

    // FootprintRequests.openFootprint = notification;

    // FootprintRequests.getFootprintInteractions(checkinID)
    // .then(function (data) {
    //   FootprintRequests.currentFootprint = data.data;
    //   $scope.selectedFootprintInteractions = FootprintRequests.currentFootprint;
    // });
  }

  $scope.displayNotifications = function () {
    UserRequests.fetchNotifications(window.sessionStorage.userFbID)
    .then(function (notifications) {
      $scope.notifications = notifications.data;
    });
  }


  // var myDropdown = $dropdown(element, {title: 'blah', content: 'bsadsda'});

  $scope.dropdown = [
    {"text": '<p class="fa fa-download"></p>&nbsp;Friends', "href": '/#/map/friends'},
    {"text": '<p class="fa fa-globe"></p>&nbsp;Add Social', "href": '/#/map/providers'},
    {divider: true},
    {"text": '<p class="fa fa-download"></p>&nbsp;Log Out', "click": 'logout()'}
  ];
}

//Inject all the dependent services needed by the controller
NavbarController.$inject = ['Auth', '$rootScope', '$scope', 'UserRequests', 'MapFactory', '$state', '$dropdown', 'FootprintRequests'];

angular.module('waddle.navbar', [])
  .controller('NavbarController', NavbarController);

})();
