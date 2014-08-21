// Controller for displaying feed which overlays map
var FeedController = function (UserRequests, MapFactory, FootprintRequests, Auth, $rootScope, $scope, $state, $timeout, $stateParams){
  Auth.checkLogin()
  .then( function (){

    var filterFeedByBounds = function () {
      var bounds = $scope.configuredMap.getBounds();
      $scope.inBounds = MapFactory.markerQuadTree.markersInBounds(bounds._southWest, bounds._northEast);
    };

    if (MapFactory.markerQuadTree) {
      filterFeedByBounds();
    }

    // When the user pans the map, we set the list of checkins visible to a scope variable for rendering in the feed
    $scope.configuredMap.on('move', function() {
      $scope.$apply(filterFeedByBounds); 
    });

    $scope.addPropsToCheckin = function (checkinID){
      var propsData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }

      FootprintRequests.giveProps(propsData);
    };

    $scope.addCheckinToBucketlist = function (checkinID){
      var bucketListData = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }

      FootprintRequests.addToBucketList(bucketListData);
    };

    //Send request to database for user props and comments data
    $scope.getFootprint = function (footprint) {
      
      $scope.footprint = footprint;

      var checkinID = footprint.checkin.checkinID;
      $scope.selectedFootprintInteractions = null;

      FootprintRequests.getFootprintInteractions(checkinID)
      .then(function (data){
        FootprintRequests.currentFootprint = data.data;
        $scope.selectedFootprintInteractions = FootprintRequests.currentFootprint;
      })
    }
  });
}

// Custom directive for submitting with ng-repeat on feed.
// Avoids binding to multiple fields, especially if duplicates
// Allows easy data manipulation in submit
var customFeedSubmit = function(FootprintRequests){
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

          // Text can be found with $element[0][0].value or scope.data.currentComment
          //ID can be found with $element.context.dataset['customSubmit']
          var commentData = {
            clickerID: window.sessionStorage.userFbID,
            checkinID: scope.footprint.checkin.checkinID,
            text: scope.comment
          }

          FootprintRequests.addComment(commentData)
          .then(function (data){
            scope.data.currentComment = ''
          })
          scope.comment = ""
          scope.$apply();
      });
    }
}

FeedController.$inject = ['UserRequests', 'MapFactory', 'FootprintRequests', 'Auth', '$rootScope', '$scope', '$state', '$timeout', '$stateParams'];


//Start creating Angular module
angular.module('waddle.feed', [])
  .controller('FeedController', FeedController)
  .directive( 'customSubmit' , customFeedSubmit);
