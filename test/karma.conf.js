module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'node_modules/angular/lib/angular.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-ui-router/lib/angular-1.2.14/angular-mocks.js',
      'client/bower_components/angular-masonry/angular-masonry.js',
      'client/dist/*.js',
      'test/unit/clientUnitTests.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
            ],

    preprocessors: {
      'client/dist/*.js': ['coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    reporters: ['progress', 'coverage'],
    
    colors: true

  });
};