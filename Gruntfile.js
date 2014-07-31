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
			lib: {
				src: [],
				dest: 'client/dist/lib.js',
				options: {
					require: ['angular'],
				}
			},
			js: {
				src: ['client/**/*.js'],
				dest: 'client/dist/bundle.js',
				options: {
					external: ['angular'],
					ignore: ['client/dist/*.js']
				}
			}

		},

		concat: {
			'client/dist/main.js': ['client/dist/lib.js', 'client/dist/bundle.js']
		},
		
		jshint: {
			all: allFiles,
			options: {
				jshintrc: '.jshintrc',
				ignores: ['client/dist/*.js'],
				force: true
			}
		},
		nodemon: {
			dev: {
				script: 'server/server.js'
			}
		},
		watch: {
			browserification: {
			  files: ['client/**/*.js'],
			  tasks: ['browserify', 'concat']
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

		grunt.task.run(['browserify', 'concat', 'jshint', 'watch']);
	});

};
