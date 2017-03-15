(function() {

angular.module('dummy')
  .controller('ProfileCtrl', ProfileCtrl)

  ProfileCtrl.$inject = ['UserService','apiService', '$location']
  function ProfileCtrl(UserService,apiService, $location) {
    var vm = this
    vm.goMain = goMain
    vm.name = UserService.username
    vm.UpdateEmail = UpdateEmail
    vm.UpdateZipcode = UpdateZipcode
    vm.updatePassword = UpdatePassword
    vm.UploadImage = UploadImage
    vm.setUploadImage = setUploadImage
    vm.goLanding = goLanding
    getEmail()
    getZipCode()
    getPicture(vm.name)

    function getEmail(){// get the email address for loggedIn from database
      apiService.getEmail({user: vm.name}).$promise.then(function(result) {
        vm.email = result.email
      }, function(error) {
        console.log('Error getting email', error)

      })
    }

    function getZipCode(){// get the zipcode  for loggedIn from database
      apiService.getZipcode({user: vm.name}).$promise.then(function(result) {
          vm.zipcode = result.zipcode
      }, function(error) {
          console.log('Error getting email', error)

      })
    }

  function goMain(){// load the main page
    $location.path('main')
  }

  function goLanding(){// go to the landing page to log in again 
    $location.path('/')
  }

  function UpdateEmail(email) {// update the email for loggedin user
    if (email!=null){
      apiService.putEmail({'email': email}).$promise.then(function(result) {
          vm.email = result.email
      }, function(error) {
        console.log('Update Email error', error)
      })

    }
}

  function UpdateZipcode(zipcode) {// update the zipcode for loggedIn user
    if (zipcode!=null){
      apiService.putZipcode({'zipcode': zipcode}).$promise.then(function(result) {
          vm.zipcode = result.zipcode
      }, function(error) {
        console.log('update Zipcode error', error)
      })

  }
}
/*update the password for the loggedin user */
 function UpdatePassword(password,passwordConfirm) {

   if (password!=null){
     if (password!= passwordConfirm){

       alert("Password and Password confirm should be the same")
     }
     else{

      apiService.putPassword({'password': password}).$promise.then(function(result) {
          vm.passwordPlaceHolder = result.status
          document.getElementById('pwdmsg').innerHTML = 'password changed'
      }, function(error) {
        console.log('Update Password error', error)
      })
    }
  }

  }
  /*upload a new profile picture for logged in user*/
  function UploadImage() {
    console.log(vm.uploadImage)
    apiService.uploadPicture({ 'img': vm.uploadImage }).$promise.then(function(result) {
        console.log('Upload Picture success')
        getPicture(vm.name)
    }, function(error) {
      console.log('Upload Picture error', error)
    })
    getPicture(vm.name)
  }

  function getPicture(Username){// load the profile picture for the logged in user

    apiService.getPicture({user:Username}).$promise.then(function(result) {
      vm.profilepic = result.pictures[0].picture
      console.log(result)
    }, function(error) {
      console.log(Username)
      console.log('error getting a picture', error)
    })
  }


  function setUploadImage(element) {
    vm.uploadImage = element.files[0]
  }
}
  })();
