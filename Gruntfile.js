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
			  files: ['client/**/*.js', 'client/styles/*.styl'],
			  tasks: ['concat:client', 'stylus']
			},

			/*linting: {
				files: allFiles,
				tasks: ['jshint']
			}*/
		},

		clean: {
				build: ['client/dist/*.js', '!client/dist/app.js']
		},

		stylus: {
      compile: {
		    files: {
		      'client/dist/style.css': 'client/styles/styles.styl' // 1:1 compile
		    }
	    }
	  },

	  mochaTest: {
	  	test: {
	  		options: {
	  			reporter: 'spec'
	  		},
	  		src: ['test/unit/serverUnitTests.js']
	  	}
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('dev', function () {
		var nodemon = grunt.util.spawn({
			cmd: 'grunt',
			grunt: true,
			args: 'nodemon'
		});

		nodemon.stdout.pipe(process.stdout);
		nodemon.stderr.pipe(process.stderr);

		//linting removed
		grunt.task.run(['clean', 'concat:client', 'stylus', 'watch']);
	});

	grunt.registerTask('build', ['clean', 'concat:client', 'stylus']);

	grunt.registerTask('test', ['mochaTest']);

};
