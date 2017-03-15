(function() {

angular.module('dummy')
  .controller('FollowingCtrl', FollowingCtrl)

FollowingCtrl.$inject = ['UserService','apiService', '$location']
function FollowingCtrl(UserService,apiService, $location) {
  var vm = this

  vm.name = UserService.username
  vm.posts = []
  vm.followmap = {}
  vm.addFollowedUser = addFollowedUser

  vm.getPicture = getPicture


  vm.deleteFollowing = deleteFollowing

  getFollowings()
//*********************functions*************************//
/*get the following names from the database
  these names will be store in a map as keys that map to there profile pictures
  and status to make it easier to display.*/


  function getFollowings(){
    apiService.getFollowings({user: vm.name}).$promise.then(function(result) {
      vm.followingUsers = result.following
      console.log('following are '+vm.followingUsers)
      vm.followingUsers.map(function (name){
        if (!vm.followmap[name]){
          vm.followmap[name] = {}
        }
        if (!vm.followmap[name]['pic']) {// store their profile pics
            apiService.getPicture({user: name}).$promise.then(function(result) {
              vm.followmap[name]['pic'] = result.pictures[0].picture
          }, function(error) {
            console.log('Error getting profile pic for user: '+name, error)
          })
        }
        if (!vm.followmap[name]['status']) {// store their status
          apiService.getStatuses({user: result.following.join()}).$promise.then(function(result) {
            result.statuses.map(function(object) {
              vm.followmap[object.username]['status'] = object.status
            })
        }, function(error) {
          console.log('Error getting statues for multiple users', error)
        })
      }
      })
      }, function(error) {
          console.log('Error in getting followers', error)

      })
  }

  function addFollowedUser(Username){// add the user to the following database
          apiService.putFollowing({user: Username}).$promise.then(function(result) {
            
            console.log("add user "+Username)
            getFollowings()
          }, function(error) {

              alert(error.data+' '+error.statusText )
              console.log('Error adding a new follower', error)
            })
          }

  function deleteFollowing(name){// delete the user from the following database
    apiService.deleteFollowing({user: name}).$promise.then(function(result) {
      getFollowings()
      }, function(error) {
      console.log('Error delete following', error)

      })
  }

  function getPicture(Username){// this is a helper function that get the profile picture

    apiService.getPicture({user:Username}).$promise.then(function(result) {
      //vm.profilepic = result.picture
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
