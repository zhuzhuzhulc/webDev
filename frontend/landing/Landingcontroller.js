(function() {

angular.module('dummy')
  .controller('LandingCtrl', LandingCtrl)




LandingCtrl.$inject = ['apiService', '$location','UserService']
function LandingCtrl(apiService, $location, UserService) {
  var vm = this
  vm.message = '?'
  vm.login = login
  vm.logout = logout
  vm.submitInputs = submitInputs
  vm.loginFB = loginFB
  vm.logout = logout

  function login() {// logged in to the website
    console.log('log in for ', vm.username)
    apiService.login({'username':vm.username, 'password':vm.password})
      .$promise.then(function(result) {
          console.log('LogIn', result)
          document.getElementById('loginMsg').innerHTML = "You are now log in as"+vm.username
          UserService.username = vm.username// set the username so that it can be share by multiple controllers
          $location.path('main')// load the main page
      })
  }
  function loginFB(){
    apiService.facebook()
      .$promise.then(function(result) {
          //console.log('LogIn', result)
          //document.getElementById('loginMsg').innerHTML = "You are now log in as"+vm.username

          UserService.username = result.username// set the username so that it can be share by multiple controllers
          $location.path('main')// load the main page
      })
  }

  function logout() {
    apiService.logout().$promise.then(function(result) {
      console.log('LogOut', result)
      $location.path('/')
    })
  }

  function updateStatus() {
    apiService.getStatus().$promise.then(function(result) {
      console.log('status', result)
      var status = result.statuses[0]
      vm.message = 'logged in as ' + status.username + ' with status "' + status.status + '"'
      UserService.username = status.username
      UserService.userStatus = status.status
      $location.path('main')
    }, function(error) {
      // error.status == 401 Unauthorized
      console.log('User not logged in', error)
      vm.message = 'Not Logged In'
      $location.path('')
    })
  }
  /*This is the function that submit all the new user information and give it to
  database to create a new user*/
  function submitInputs(name,email,phone,zipcode,password){
    apiService.register({
      'username'	: name,
      'email'		: email,
      'zipcode'	: zipcode,
      'password'	: password
    }).$promise.then(function(result) {
      console.log(result)
      $location.path('/')
      document.getElementById('registerMsg').innerHTML = 'register new user'
    }, function(error) {
      console.log('registration error', error)
    })
  }

  function facebook(){// a new api will be used for hw8
    apiService.facebook().$promise.then(function(result){
      console.log('log in with facebook')
    },function(error){
      console.log('error login with facebook',error)
    })
  }
}

})();
