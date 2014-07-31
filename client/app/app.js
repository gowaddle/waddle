var angular = require('angular');
angular.module('app', [])

.controller('Ctrl', function ($scope) {
	$scope.data = {name: 'yooooo'};
})

.directive('myThing', function () {
	return {
		restrict: 'E',
		template: '<div><input><button ng-click="change()">change</button></div>',
		scope: {
			things: '='
		},
		link: function (scope) {
			scope.change = function () {
				scope.things.name = 'something';
			};
		}
	};
});


