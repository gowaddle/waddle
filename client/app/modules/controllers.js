angular.module('waddle.controllers', ['waddle.frontpage', 'waddle.map'])
	.controller('Ctrl', function ($scope) {
		$scope.data = {name: 'yooooo'};
	});
