'use strict';

angular.module('pt', ['ngRoute', 'pt.nav', 'pt.hub', 'pt.plans', 'angularMoment', 'ngMaterial', 'ngStorage'])
.run(['$rootScope', '$location', '$sessionStorage', function($rootScope, $location, $sessionStorage) {
	$rootScope.go = function(path) {
  		$location.path(path);
	};

	$rootScope.$storage = $sessionStorage;
	$rootScope.$storage.$reset();
}]);

angular.module('pt')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',  {
        redirectTo      :   '/hub'
    });
    $routeProvider.when('/404',  {
        templateUrl     :   'views/404.html'
    });
    $routeProvider.otherwise({redirectTo: '/404'});
}])
.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    	.primaryPalette('orange')
    	.accentPalette('blue');
});