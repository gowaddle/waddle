angular.module('waddle.friends', [])
  .controller('FriendsController', function ($scope, $state) {
      $scope.testing = ['a', 'friend'];
      console.log($scope.testing);
  });