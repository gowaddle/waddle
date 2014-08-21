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
			bower: {
				dest: 'client/dist/bower.js',
				src: ['client/bower_components/lodash/lodash.compat.js', 'client/bower_components/jquery/jquery.js', 'client/bower_components/jquery-bridget/jquery.bridget.js',
					'client/bower_components/get-style-property/get-style-property.js', 'client/bower_components/get-size/get-size.js',
					'client/bower_components/eventEmitter/EventEmitter.js', 'client/bower_components/eventie/eventie.js',
					'client/bower_components/doc-ready/doc-ready.js', 'client/bower_components/matches-selector/matches-selector.js',
					'client/bower_components/outlayer/item.js', 'client/bower_components/outlayer/outlayer.js',
					'client/bower_components/masonry/masonry.js', 'bower_components/imagesloaded/imagesloaded.js']
			}
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
				script: 'server/server.js',
				options: {
					ignore: ['node_modules/**', 'client/bower_components/**'],
				}
			}
		},

		watch: {
			build: {
			  files: ['client/app/**/*.js', 'client/styles/*.styl'],
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
	  		src: ['test/unit/serverUnitTests.js', 'test/integration/integrationTests.js']
	  	}
	  },

	  bower: {
	  	install: {
	  		options: {
		  		targetDir: './client/bower_components',
		  		cleanBowerDir: true
	  		}
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
	grunt.loadNpmTasks('grunt-bower-task');


	grunt.registerTask('dev', function () {
		var nodemon = grunt.util.spawn({
			cmd: 'grunt',
			grunt: true,
			args: 'nodemon'
		});

		nodemon.stdout.pipe(process.stdout);
		nodemon.stderr.pipe(process.stderr);

		//linting removed
		grunt.task.run(['clean', 'concat:bower', 'concat:client', 'stylus', 'watch']);
	});

	grunt.registerTask('build', ['clean', 'bower', 'concat:bower', 'concat:client', 'stylus']);

	grunt.registerTask('test', ['mochaTest']);

};
