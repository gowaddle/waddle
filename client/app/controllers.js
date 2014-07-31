'use strict';
var angular = require('angular');

module.exports = angular.module('waddle.controllers', ['waddle.frontpage'])
	.controller('Ctrl', function ($scope) {
		$scope.data = {name: 'yooooo'};
	});