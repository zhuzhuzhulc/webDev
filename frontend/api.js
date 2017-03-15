(function() {
  angular.module('dummy')
    //.constant('apiURL', 'https://webdev-dummy.herokuapp.com')
    .constant('apiURL', 'https://cl40hw8.herokuapp.com')
    //.constant('apiURL', 'http://localhost:3000')
    .factory('apiService', apiService)

function apiService($resource, apiURL, $http) {
  $http.defaults.withCredentials = true
	return $resource(apiURL + '/:endpoint/:id/:user', {id:'@id',user:'@user' },
		{
			login    : { method:'POST', params: {endpoint: 'login'  } },
			logout   : { method:'PUT' , params: {endpoint: 'logout' } },

			getStatus: { method:'GET' , params: {endpoint: 'status' } },
      setStatus: { method:'PUT', params: {endpoint: 'status'} },
      getStatuses: 	{ method:'GET', params: {endpoint: 'statuses' } },

      getPosts : { method:'GET', params: {endpoint: 'posts' } },
      editPosts : { method:'PUT', params: {endpoint: 'posts' } },

      register: 		{ method:'POST', params: {endpoint: 'register'	} },
      getEmail: 		{ method:'GET', params: {endpoint: 'email'	} },
      putEmail: 		{ method:'PUT', params: {endpoint: 'email'	} },
      getZipcode: 	{ method:'GET', params: {endpoint: 'zipcode'	} },
      putZipcode: 	{ method:'PUT', params: {endpoint: 'zipcode'	} },
      putPassword: 	{ method:'PUT', params: {endpoint: 'password' } },
      getPicture:   { method:'GET', params: {endpoint: 'pictures' } },

      getFollowings:  { method:'GET', params: {endpoint: 'following'} },
      putFollowing: 	{ method:'PUT', params: {endpoint: 'following'} },
      deleteFollowing:{ method:'DELETE', params: {endpoint: 'following'} },

      facebook:{method:'get',params:{endpoint:'authfacebook'}},
      //addPost:{method:'POST',params:{endpoint:'post'}},//add text-only posts

      uploadPicture: 	{
      method: 'PUT',
      headers: { 'Content-Type': undefined },
      transformRequest: resourceUploadFile,
      params: {endpoint: 'picture'}
      },

      addPost: 	{
      method: 'POST',
      headers: { 'Content-Type': undefined },
      transformRequest: resourceUploadFile,
      params: {endpoint: 'post'}
      }
		})
}
function resourceUploadFile(data) {
     var fd = new FormData()
     fd.append('image', data.img)
     fd.append('body', data.body)
     return fd;
}

})();
