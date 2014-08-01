'use strict';

var allFiles = [
  '*.js',
  'client/**/*.js',
  'server/**/*.js',
];

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			client: {
				dest: 'client/dist/app.js',
				src: ['client/utils/*.js', 'client/app/app.js', 'client/app/modules/**/*.js']
			},
		},
		
		jshint: {
			all: allFiles,
			options: {
				jshintrc: '.jshintrc',
				ignores: ['client/dist/*.js', 'client/utils/openfb.js'],
				force: true
			}
		},
		nodemon: {
			dev: {
				script: 'server/server.js'
			}
		},
		watch: {
			build: {
			  files: ['client/**/*.js'],
			  tasks: ['concat:client']
			},
			linting: {
				files: allFiles,
				tasks: ['jshint']
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('dev', function () {
		var nodemon = grunt.util.spawn({
			cmd: 'grunt',
			grunt: true,
			args: 'nodemon'
		});

		nodemon.stdout.pipe(process.stdout);
		nodemon.stderr.pipe(process.stderr);

		grunt.task.run(['concat:client', 'jshint', 'watch']);
	});

};
