'use strict';

var allFiles = [
  '*.js',
  'client/**/*.js',
  'server/**/*.js',
];

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			js: {
				src: ['client/**/*.js'],
				dest: 'client/dist/bundle.js',
				options: {
					require: ['angular'],
					ignore: ['client/dist/*.js']
				}
			}
		},
		
		jshint: {
			all: allFiles,
			options: {
				jshintrc: '.jshintrc',
				ignores: ['client/dist/*.js'],
				force: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.registerTask('dev', ['browserify', 'jshint']);
};
