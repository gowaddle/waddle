angular.module('waddle.feed', [])
  .controller('FeedController', function ($scope) {
  	  $scope.testing = ['hello', 'hi', 'how are you?', 'is this working?'];
      console.log($scope.testing);
  });