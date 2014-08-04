module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'node_modules/angular/lib/angular.js',
      'node_modules/angular-ui-router/lib/angular-1.2.14/angular-mocks.js',
/*      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-mocks/angular-mocks.js',*/
      'client/dist/*.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    colors: true

  });
};