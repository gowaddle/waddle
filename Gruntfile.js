'use strict';

var allFiles = [
  '*.js',
  'client/**/*.js',
  'server/**/*.js',
];

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		jshint: {
			all: allFiles,
			options: {
				jshintrc: '.jshintrc',
				force: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('dev', ['jshint']);
};
