describe('Angular testing framework', function() {
  var element;
  var $scope;
  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope;
    compile = $compile
    element = angular.element('<div>{{2 + 2}}</div>');
    element = $compile(element)($rootScope)
  }));

  it('should say hello', function () {
    var element = compile('<div>hello</div>')(scope);
    expect(element[0].textContent).toBe('hello');
  });    

  it('should inject compile and rootScope for testing', function () {
    scope.$digest()  //use apply?
    expect(element.html()).toBe('4');
  });
});


describe('Higher-level app tests', function() {
  beforeEach(module('waddle'));

  it('should exist', function () {
    expect(angular.module('waddle')).toBeDefined();
  });

  it('should load modules', function () {
    expect(angular.module('waddle')['requires'].length).toBeDefined;
  });
});

describe('Tests for angular controllers', function() {
  beforeEach(module('waddle'));

  describe('Tests for frontpage controller', function() {
    beforeEach(inject(function($rootScope, $controller, $state) {
      scope = $rootScope.$new
      $controller('FrontpageController', {
        $scope: scope
      });
    }));

    it('should have a login function', function () {
      expect(scope.login).toBeDefined();
    })
  });
});