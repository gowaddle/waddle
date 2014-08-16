angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests) {


    $scope.allUserCheckinsFootprints = UserRequests.allData.data.allCheckins;
    $scope.selectedFootprint = null;


    console.log(UserRequests.allData);
    $scope.allUserCheckinsFeed = {
      get: function(index, count, success) {
          //var results = UserRequests.allData.data.allCheckins;
          var results = $scope.data.currentCheckins;
          console.log(results)
          success(results);
      }
    };

    $scope.addCommentToCheckin = function (checkinID){
      //console.log(checkinID)
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
      console.log($scope.selectedFootprint);
      $scope.selectedFootprint = footprint;
      console.log($scope.selectedFootprint);

    }
  });
