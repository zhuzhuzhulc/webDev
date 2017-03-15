(function() {
  angular.module('dummy', ['ngRoute', 'ngResource'])
    .config(config)


  function config($routeProvider) {
  	$routeProvider
  	.when('/', {
  		templateUrl: 'landing/landing.html',
      controller:'LandingCtrl as vm'
  	})
  	.when('/main', {
  		templateUrl: 'main.html',
      //controller:'MainCtrl as vm'
  	})
    .when('/profile', {
      templateUrl: 'Profile/profile.html',
      controller:'ProfileCtrl as vm'
    })
  	.otherwise({
  	  		redirectTo: 'landing.html'

  	})
  }

})();
