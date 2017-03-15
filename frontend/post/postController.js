(function() {

angular.module('dummy')
  .controller('PostCtrl', PostCtrl)

PostCtrl.$inject = ['UserService','apiService', '$location']
function PostCtrl(UserService,apiService, $location) {
  var vm = this

	vm.getUsername = getUsername

  vm.name = UserService.username
  vm.posts = []


	vm.loadPosts = loadPosts
	vm.removePost = removePost
  vm.addPost = addPost
  vm.editPosts = editPosts
  vm.newComment = newComment
  vm.editComment = editComment
  vm.getPicture = getPicture
  vm.setUploadImage = setUploadImage


  loadPosts()// load all the posts when load the page
  getPicture(vm.name)

//*********************functions*************************//




function getUsername() {
  //user service
  return vm.name
}



function loadPosts() {// load all the posts from the database
  vm.posts.length = 0
  apiService.getPosts().$promise.then(function(result) {
    result.posts.forEach(function(post) {
      vm.posts.push(post)
    })
  })
}

function removePost(postId) {// remove a post from the webpage, note: this won't
                              // remove the post from database, this just remove
                              // the post so that loggedIn user won't see it
      var index = vm.posts.findIndex(function(post) {
           return post.id === postId
      })
      if (index >= 0) {
           vm.posts.splice(index, 1)
      }
}

function addPost() {// add a new post to the database
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
  function editPosts(postId){//edit a post which author is the loggedIn user

    if (vm.editPostBody){
      apiService.editPosts({id:postId,body:vm.editPostBody}).$promise.then(function(result) {
        console.log("update post succeed")
        loadPosts()
      }, function(error) {// unauthorized error may be throw if edit other user's post
      console.log(vm.editPostBody)
        console.log('error update post', error)
    })
    loadPosts()
    }

  }
  function newComment(postId){// add a comment to the post
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

  function editComment(postId,commentId){// edit a comment which author is the loggedIn user
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




  function getPicture(Username){// get the profile picture for the Username input

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
  function setUploadImage(element) {//a helper function that help loading the image to upload.
    vm.uploadImage = element.files[0]
  }
}

})();
