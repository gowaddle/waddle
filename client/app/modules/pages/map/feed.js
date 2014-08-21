angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests, MapFactory, $state, $timeout, $stateParams, FootprintRequests) {

    $scope.selectedFootprint = null;
    $scope.selectedFootprintInteractions = null;

    var filterFeedByBounds = function () {
      var bounds = $scope.configuredMap.getBounds();
      $scope.inBounds = MapFactory.markerQuadTree.markersInBounds(bounds._southWest, bounds._northEast);
      console.log($scope.inBounds)
    };

    // When the user pans the map, we set the list of checkins visible to a scope variable for rendering in the feed
    $scope.configuredMap.on('move', function() {
      $scope.$apply(filterFeedByBounds); 
    });

    filterFeedByBounds();

    $scope.addPropsToCheckin = function (checkinID){
      console.log(checkinID);

      var propsData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }

      FootprintRequests.giveProps(propsData)
      .then(function (data){
        console.log(data);
      });
    }

    $scope.addCheckinToBucketlist = function (checkinID){
      var data = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkinID
      }
       FootprintRequests.addToBucketList(data)
    }

    //Send request to database for user props and comments data
    $scope.getFootprint = function (footprint) {

      $scope.footprint = footprint;
      $scope.selectedFootprintInteractions = null;

      FootprintRequests.getFootprintInteractions(footprint.checkin.checkinID)
      .then(function (data){
        FootprintRequests.currentFootprint = data.data;
        $scope.selectedFootprintInteractions = FootprintRequests.currentFootprint;
      })
    }
  })

.directive( 'customSubmit' , function(FootprintRequests)
{
    return {
        restrict: 'A',
        link: function( scope , element , attributes )
        {
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
                
                console.log("element")
                console.log($element)               
                console.log("scope")
                console.log(scope)
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
                  scope.data.currentComment = ''
                  //$element[0][0].value = ''
                })
                console.log(commentData)
                scope.comment = ""
                scope.$apply();
            });
        }
    };
});
