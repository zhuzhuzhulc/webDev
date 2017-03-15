describe('Main Controller Tests', function() {
  var ctrl;

  beforeEach(module('dummy'))

  beforeEach(inject(function($controller){
      ctrl = $controller('MainCtrl');
  }));
    it('has multiple posts',function(){
      ctrl.loadPosts()
      console.log(ctrl.posts.length)
      expect(ctrl.posts.length).not.toBe(0)
    })
})
