(function() {
  angular.module('dummy')
    .factory('UserService', UserService)
    function UserService(){
      return{
        username:null,
        userStatus:null,
        posts:null,
        picture:null
      }
    }

})();
