angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests) {
    
    $scope.addCommentToCheckin = function (checkin){
      var dummyData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkin,
        text: "we love dummy data"
      }
      UserRequests.addComment(dummyData)     
    }

    $scope.allUserCheckinsFootprints = UserRequests.allData.data.allCheckins;
    console.log(UserRequests.allData);
  	$scope.allUserCheckinsFeed = {
      get: function(index, count, success) {
      	  //var results = UserRequests.allData.data.allCheckins;
          var results = $scope.data.currentCheckins;
          console.log(results)
          success(results);
      }
    };

    $scope.addCheckinToBucketlist = function (checkin){
      var data = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkin
      }
       UserRequests.addToBucketList(data)
    }

  });
