angular.module('waddle.feed', [])

  .controller('FeedController', function ($rootScope, $scope, UserRequests) {


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

    $scope.addCommentToCheckin = function (checkin){
      //console.log(checkin)
      var node = document.querySelectorAll(".comment" + checkin + ".ng-dirty")
      
      var commentData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkin,
        text: node[0].value
      }

      UserRequests.addComment(commentData) 
      .then(function (data){
        node[0].value = "Comment Posted!" 
      })    
    }

    $scope.addPropsToCheckin = function (checkin){
      console.log(checkin);

      var propsData = {
        clickerID: window.sessionStorage.userFbID,
        checkinID: checkin
      }

      UserRequests.giveProps(propsData)
      .then(function (data){
        console.log(data);
      });
    }

    $scope.addCheckinToBucketlist = function (checkin){
      var data = {
        facebookID: window.sessionStorage.userFbID,
        checkinID: checkin
      }
       UserRequests.addToBucketList(data)
    }
  });
