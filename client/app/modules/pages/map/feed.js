angular.module('waddle.feed', [])
  .controller('FeedController', function ($scope, $timeout) {
  	$scope.datasource = {
    get: function(index, count, success) {
      $timeout(function() {
        var start = Math.max(0, index);
        var end = Math.min(index + count, 100);
        
        var results = [];
        for (var i = start; i < end; i++) {
          results.push("Index: " + i);
        }
        
        success(results);
      }, 100);
    }
  };
  });