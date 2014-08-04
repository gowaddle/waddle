describe("Angular testing framework", function() {
    var element;
    var $scope;
    beforeEach(inject(function($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile
        element = angular.element("<div>{{2 + 2}}</div>");
        element = $compile(element)($rootScope)
    }))

    it('The test should inject compile and rootScope for testing', function() {
      scope.$digest()  //use apply
      expect(element.html()).toBe("4");
    })

    it("should say hello", function() {
      var element = compile('<div>hello</div>')(scope);
      console.log(element[0].textContent)
      expect(element[0].textContent).toBe('hello');
    });    
})
