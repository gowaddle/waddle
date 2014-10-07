'use strict';

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
				src: ['client/bower_components/jquery/jquery.js',
					'client/bower_components/lodash/lodash.compat.js',
					'client/bower_components/eventEmitter/EventEmitter.js',
					'client/bower_components/get-style-property/get-style-property.js',
					'client/bower_components/get-size/get-size.js',
					'client/bower_components/jquery-bridget/jquery.bridget.js',
					'client/bower_components/eventie/eventie.js',
					'client/bower_components/doc-ready/doc-ready.js',
					'client/bower_components/matches-selector/matches-selector.js',
					'client/bower_components/outlayer/item.js', 'client/bower_components/outlayer/outlayer.js',
					'client/bower_components/masonry/masonry.js',
					'client/bower_components/imagesloaded/imagesloaded.js',
					'client/bower_components/angular/angular.js',
					'client/bower_components/angular-ui-router/angular-ui-router.js',
					'client/bower_components/angular-masonry/angular-masonry.js',
					'client/bower_components/angular-strap/dist/angular-strap.min.js',
					'client/bower_components/angular-strap/dist/angular-strap.tpl.min.js',
					'client/bower_components/angular-strap/src/helpers/dimensions.js',
					'client/bower_components/angular-strap/src/tooltip/tooltip.js',
					'client/bower_components/angular-strap/src/dropdown/dropdown.js',
					'client/bower_components/angular-sanitize/angular-sanitize.min.js'
				]
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
			  tasks: ['concat:client', 'stylus', 'uglify:dev']
			}
		},

		clean: {
				dist: ['client/dist/*.js', 'client/dist/*.css']
		},

		stylus: {
      compile: {
		    files: {
		      'client/dist/style.min.css': 'client/styles/styles.styl'
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
		  		cleanup: true
	  		}
	  	}
	  },

    uglify: {
      dev: {
      	options: {
	    		mangle: false,
	    		beautify: true
	    	},
        files: {
          'client/dist/app.min.js': ['client/dist/bower.js', 'client/dist/app.js']
        }
      },
      build : {
      	files: {
          'client/dist/app.min.js': ['client/dist/bower.js', 'client/dist/app.js']
        }
      }
    }
	});

	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('dev', function () {
		var nodemon = grunt.util.spawn({
			cmd: 'grunt',
			grunt: true,
			args: 'nodemon'
		});
		nodemon.stdout.pipe(process.stdout);
		nodemon.stderr.pipe(process.stderr);

		grunt.task.run(['clean', 'concat:bower', 'concat:client', 'stylus', 'uglify:dev', 'watch']);
	});

	grunt.registerTask('build', ['clean', 'bower', 'concat:bower', 'concat:client', 'stylus', 'uglify:build']);

	grunt.registerTask('test', ['mochaTest']);
};
