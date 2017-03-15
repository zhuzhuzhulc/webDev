(function() {
/* This main controller is now seperated into post status and following controller to meet the requirement
*/
angular.module('dummy')
  .controller('MainCtrl', MainCtrl)

MainCtrl.$inject = ['UserService','apiService', '$location']
function MainCtrl(UserService,apiService, $location) {
  var vm = this
  vm.logout = logout;
	vm.getUsername = getUsername
  vm.updateStatus = updateStatus
  vm.name = UserService.username
  vm.posts = []
  vm.followmap = {}
  vm.addFollowedUser = addFollowedUser
	vm.loadPosts = loadPosts
	vm.removePost = removePost
  vm.addPost = addPost
  vm.editPosts = editPosts
  vm.newComment = newComment
  vm.editComment = editComment
  vm.getPicture = getPicture
  vm.setUploadImage = setUploadImage
  vm.goProfile = goProfile
  vm.deleteFollowing = deleteFollowing
  getStatus()
  loadPosts()
  getPicture(vm.name)
  getFollowings()
//*********************functions*************************//
  function logout() {
    apiService.logout().$promise.then(function(result) {
      console.log('LogOut', result)
      $location.path('/')

    })
  }
  function goProfile() {
    $location.path('profile')
  }

  function getStatus() {
  apiService.getStatus().$promise.then(function(result) {
    vm.userStatus = result.statuses[0].status
    vm.newUserStatus = vm.userStatus
          vm.loggedIn = true
  })
}

function getUsername() {
  //user service
  return vm.name
}

function updateStatus() {
  apiService.setStatus({ status: vm.newUserStatus}).$promise.
  then(function(result) {
          console.log(result)
    vm.userStatus = result.statuses[0].status
    vm.newUserStatus = vm.userStatus
  })
  //getStatus()
}

function loadPosts() {
  vm.posts.length = 0
  apiService.getPosts().$promise.then(function(result) {
    result.posts.forEach(function(post) {
      vm.posts.push(post)
    })
  })
}

function removePost(postId) {
      var index = vm.posts.findIndex(function(post) {
           return post.id === postId
      })
      if (index >= 0) {
           vm.posts.splice(index, 1)
      }
}

function addPost() {
  if (vm.newPostBody) {
        apiService.addPost({body: vm.newPostBody, img: vm.uploadImage}).$promise.then(function(result) {
          console.log("add new post succeed")
          console.log(vm.uploadImage)
          loadPosts()
      }, function(error) {
        console.log(vm.newPostBody)
          console.log('error adding post', error)
      })
      loadPosts()
  }
}
  function editPosts(postId){

    if (vm.editPostBody){
      apiService.editPosts({id:postId,body:vm.editPostBody}).$promise.then(function(result) {
        console.log("update post succeed")
        loadPosts()
      }, function(error) {
      console.log(vm.editPostBody)
        console.log('error update post', error)
    })
    loadPosts()
    }

  }
  function newComment(postId){
    if (vm.newcomment){
      apiService.editPosts({id:postId,body:vm.newcomment,commentId:-1}).$promise.then(function(result) {
        console.log("post new comment succeed")
        loadPosts()
      }, function(error) {
      console.log(vm.newcomment)
        console.log('error post new comment', error)
    })
    loadPosts()
    }
  }

  function editComment(postId,commentId){
    if (vm.editcomment){
      apiService.editPosts({id:postId,body:vm.editcomment,commentId:commentId}).$promise.then(function(result) {
        console.log("edit comment succeed")
        loadPosts()
      }, function(error) {
      console.log(vm.editcomment)
        console.log('error edit comment ', error)
    })
    loadPosts()
    }
  }

  function getFollowings(){
    apiService.getFollowings({user: vm.name}).$promise.then(function(result) {
      vm.followingUsers = result.following
      console.log('following are '+vm.followingUsers)
      vm.followingUsers.map(function (name){
        if (!vm.followmap[name]){
          vm.followmap[name] = {}
        }
        if (!vm.followmap[name]['pic']) {
            apiService.getPicture({user: name}).$promise.then(function(result) {
              vm.followmap[name]['pic'] = result.pictures[0].picture
          }, function(error) {
            console.log('Error getting profile pic for user: '+name, error)
          })
        }
        if (!vm.followmap[name]['status']) {
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

  function addFollowedUser(Username){
          apiService.putFollowing({user: Username}).$promise.then(function(result) {
            //vm.followingUsers.push(Username)
            console.log("add user "+Username)
            getFollowings()
          }, function(error) {

              alert(error.data+' '+error.statusText )
              console.log('Error adding a new follower', error)
            })
          }

  function deleteFollowing(name){
    apiService.deleteFollowing({user: name}).$promise.then(function(result) {
      getFollowings()
      }, function(error) {
      console.log('Error delete following', error)

      })
  }

  function getPicture(Username){

    apiService.getPicture({user:Username}).$promise.then(function(result) {
      //vm.profilepic = result.picture
      vm.profilepic = result.pictures[0].picture
      var URL = result.picture
      console.log(result)
    }, function(error) {
      console.log(Username)
      console.log('error getting a picture', error)
    })
    //return URL
  }
  function setUploadImage(element) {
    vm.uploadImage = element.files[0]
  }
}

})();
