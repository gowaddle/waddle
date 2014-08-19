angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests, MapFactory, $state) {

    $scope.allUserCheckinsFootprints = UserRequests.allData.data.allCheckins;
    $scope.selectedFootprint = null;

    console.log('InBounds: ', $scope.inBounds);
    console.log('AllUserCheckins: ', $scope.allUserCheckinsFootprints);


    var filterFeedByBounds = function () {
      var bounds = $scope.configuredMap.getBounds();
      var markers = MapFactory.markerQuadTree.markersInBounds(bounds._southWest, bounds._northEast);
      $scope.inBounds = {
        get: function(index, count, success) {
            success(markers);
        }
      };
      console.log('filterfeed')
      console.log( $scope.inBounds );
      console.log( $state.current );
    };

    // When the user pans the map, we set the list of checkins visible to a scope variable for rendering in the feed
    $scope.configuredMap.on('move', function() {
      filterFeedByBounds();
    });

    filterFeedByBounds();

   //TODO: move functions for user interaction to custom directive
    $scope.addCommentToCheckin = function (checkinID){
      var node = document.querySelectorAll(".comment" + checkinID + ".ng-dirty")
      
      var commentData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkinID,
        text: node[0].value
      }

      UserRequests.addComment(commentData) 
      .then(function (data){
        node[0].value = "Comment Posted!" 
      })    
    }

    $scope.addPropsToCheckin = function (checkinID){
      console.log(checkinID);

      var propsData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }

      UserRequests.giveProps(propsData)
      .then(function (data){
        console.log(data);
      });
    }

    $scope.addCheckinToBucketlist = function (checkinID){
      var data = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }
       UserRequests.addToBucketList(data)
    }

    $scope.getFootprint = function (footprint) {
      $scope.selectedFootprint = footprint;
      UserRequests.getFootprintInteractions(footprint.checkin.checkinID)
      .then(function (data){
        UserRequests.currentFootprint = data.data
        console.log(UserRequests.currentFootprint)
        $scope.data.footprint.propNumber = data.data.props;
        $scope.data.footprint.propGivers = data.data.propGivers;
        $scope.data.footprint.comments = data.data.comments;
      })
    }
  });
