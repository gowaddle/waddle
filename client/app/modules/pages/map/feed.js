(function(){

var FeedController = function (MapFactory, FootprintRequests, UserRequests, Auth, $scope, $rootScope, $state, Socket) {
  Auth.checkLogin()
  .then( function (){
    // Finds all points on the map that are within the bottom left and top right
    // points on the user's view
    if ($scope.currentMap && MapFactory.markerQuadTree) {
      MapFactory.filterFeedByBounds($scope.currentMap.getBounds());
      
      MapFactory.filterFeedByBounds($scope.currentMap.getBounds());
      $scope.inBoundsObject = MapFactory.currentInBounds;

      // When the user pans the map, we set the list of checkins visible to a scope variable for rendering in the feed
      $scope.currentMap.on('move', function() {
        $scope.inBoundsObject = MapFactory.currentInBounds;
        $scope.$apply(function(){
          MapFactory.filterFeedByBounds($scope.currentMap.getBounds())
        });

      });
    }

     
     $scope.socketTest = function() {
      console.log('hi');
      Socket.emit('hi', 'hello my socket');
       // Socket.forward('news', $scope);
       // $scope.$on('Socket:news', function(ev, data) {
       //  console.log(data);
       //  $scope.theData = data;
       // })
     }
     Socket.on('hi', function(data) {
      console.log('client says: ' + data);
     })

    // $scope.footprintsCount = UserRequests.allData.allCheckins.length;

    $scope.removeComment = function() {
      console.log('reached remove comment');
    }

    $scope.addPropsToCheckin = function (footprint){
      
      var propsData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: footprint.checkin.checkinID
      }

      FootprintRequests.giveProps(propsData)
      .then(function (data) {
        //this function seems unnecessary - look into later
        $scope.getFootprint(footprint);

        // Add liked property to checkin, updating markerQuadTree and refreshing inBounds
        // The second and third arguments to addPropertyToCheckin add to footprint.checkin 
        MapFactory.markerQuadTree.addPropertyToCheckin(footprint, 'liked', true);
        filterFeedByBounds();
      });
    };

    $scope.addCheckinToBucketList = function (footprint){
      var bucketListData = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: footprint.checkin.checkinID
      }
      FootprintRequests.addToBucketList(bucketListData)
      .then(function (data){ 
        // Add bucketed property to checkin, updating markerQuadTree and refreshing inBounds
        // The second and third arguments to addPropertyToCheckin add to footprint.checkin 
        MapFactory.markerQuadTree.addPropertyToCheckin(footprint, 'bucketed', true);
        filterFeedByBounds();
      });
    };

    $scope.removeCheckinFromBucketList = function (footprint){
      console.log('removed?');
      var bucketListData = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: footprint.checkin.checkinID
      };
      FootprintRequests.removeFromBucketList(bucketListData)
      .then(function (data){
        MapFactory.markerQuadTree.addPropertyToCheckin(footprint, 'bucketed', false);
      });
    };

    $scope.selectedFootprintInteractions = null;
    
    // Send request to database for user props and comments data
    // Format of returned object is {data: {props: String(Int), propGivers: [], comments:[]}}
    $scope.getFootprint = function (footprint) {
      $scope.footprint = footprint;

      var checkinID = footprint.checkin.checkinID;
      FootprintRequests.openFootprint = footprint;

      FootprintRequests.getFootprintInteractions(checkinID)
      .then(function (data) {
        FootprintRequests.currentFootprint = data.data;
        $scope.selectedFootprintInteractions = FootprintRequests.currentFootprint;
      });
    };

    $scope.closeFootprintWindow = function (){
      FootprintRequests.openFootprint = undefined;
      $state.go('map.feed')
    };

    // Ensure that a user comment is posted in the database before displaying
    $scope.updateFootprint = function (footprint){
      var checkinID = footprint.checkin.checkinID;
      FootprintRequests.getFootprintInteractions(checkinID)
      .then(function (data) {
        $scope.selectedFootprintInteractions.comments = data.data.comments;
      });  
    };
//    $scope.removeCommenttest = function()
  //  {
    //  console.log("del reached");
    //}

     $scope.removeComment = function (footprint, comment){
      console.log(footprint);
      console.log(comment);
      var commentData = {
        facebookID: comment.commenter.facebookID,
        checkinID: footprint.checkin.checkinID,
        commentID : comment.comment.commentID 
      };
      console.log(commentData);
      FootprintRequests.removeComment(commentData)
      .then(function (data){
        console.log("success");
        //MapFactory.markerQuadTree.addPropertyToCheckin(footprint, 'bucketed', false);
      });
    };
  });
}

FeedController.$inject = ['MapFactory', 'FootprintRequests', 'UserRequests', 'Auth', '$scope', '$rootScope', '$state', 'Socket'];

  // Custom Submit will avoid binding data to multiple fields in ng-repeat and allow custom on submit processing

var CustomSubmitDirective = function(FootprintRequests) {
  return {
    restrict: 'A',
    link: function( scope , element , attributes ){
      var $element = angular.element(element);
      
      // Add novalidate to the form element.
      attributes.$set( 'novalidate' , 'novalidate' );
      
      $element.bind( 'submit' , function( e ) {
        e.preventDefault();
        
        // Remove the class pristine from all form elements.
        $element.find( '.ng-pristine' ).removeClass( 'ng-pristine' );
        
        // Get the form object.
        var form = scope[ attributes.name ];
        
        // Set all the fields to dirty and apply the changes on the scope so that
        // validation errors are shown on submit only.
        angular.forEach( form , function( formElement , fieldName ) {
          // If the fieldname starts with a '$' sign, it means it's an Angular
          // property or function. Skip those items.
          if ( fieldName[0] === '$' ) return;
          
          formElement.$pristine = false;
          formElement.$dirty = true;
        });
        
        // Do not continue if the form is invalid.
        if ( form.$invalid ) {
          // Focus on the first field that is invalid.
          $element.find( '.ng-invalid' ).first().focus();
          
          return false;
        }
        
        // From this point and below, we can assume that the form is valid.
        scope.$eval( attributes.customSubmit );

        //Text can be found with $element[0][0].value or scope.data.currentComment
        //ID can be found with $element.context.dataset['customSubmit']
        var commentData = {
          clickerID: window.sessionStorage.userFbID,
          checkinID: scope.footprint.checkin.checkinID,
          text: scope.comment
        }

        FootprintRequests.addComment(commentData)
        .then(function (data){

          if (FootprintRequests.openFootprint){
            scope.updateFootprint(FootprintRequests.openFootprint)
          }
          scope.data.currentComment = ''
          //$element[0][0].value = ''
        })
        console.log(commentData)
        scope.comment = ""
        scope.$apply();
      });
    }
  };
};

CustomSubmitDirective.$inject = ['FootprintRequests'];

//Start creating Angular module
angular.module('waddle.feed', [])
  .controller('FeedController', FeedController)
  .directive( 'customSubmit' , CustomSubmitDirective);


})();