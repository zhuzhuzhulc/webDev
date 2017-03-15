(function() {

angular.module('dummy')
  .controller('StatusCtrl', StatusCtrl)

StatusCtrl.$inject = ['UserService','apiService', '$location']
function StatusCtrl(UserService,apiService, $location) {
  var vm = this
  vm.logout = logout;
	vm.getUsername = getUsername
  vm.updateStatus = updateStatus
  vm.name = UserService.username
  vm.getPicture = getPicture
  vm.goProfile = goProfile

  getStatus()
  getPicture(vm.name)

//*********************functions*************************//

//function that logout the user
  function logout() {
    apiService.logout().$promise.then(function(result) {
      console.log('LogOut', result)
      $location.path('/')

    })
  }
  // go to the profile page
  function goProfile() {
    $location.path('profile')
  }
  // get the status for the user from database
  function getStatus() {
  apiService.getStatus().$promise.then(function(result) {
    vm.userStatus = result.statuses[0].status
    vm.newUserStatus = vm.userStatus
          vm.loggedIn = true
  })
}


function getUsername() {
    return vm.name
}

//update status for the loggedIn user
function updateStatus() {
  apiService.setStatus({ status: vm.newUserStatus}).$promise.
  then(function(result) {
          console.log(result)
    vm.userStatus = result.statuses[0].status
    vm.newUserStatus = vm.userStatus
  })
}

//get the profile picture
function getPicture(Username){
  apiService.getPicture({user:Username}).$promise.then(function(result) {
    vm.profilepic = result.pictures[0].picture
    var URL = result.picture
    console.log(result)
  }, function(error) {
    console.log(Username)
    console.log('error getting a picture', error)
  })
}
}

})();
