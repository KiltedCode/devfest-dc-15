'use strict';

angular.module('pt', ['ngRoute', 'pt.nav', 'pt.hub', 'pt.plans', 'angularMoment', 'ngMaterial'])
.run(['$rootScope', '$location', function($rootScope, $location) {
	$rootScope.go = function(path) {
  		$location.path(path);
	};

}]);

angular.module('pt')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',  {
        redirectTo      :   '/hub'
    });
    // $routeProvider.otherwise({redirectTo: '/404'});
}])
.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    	.primaryPalette('orange')
    	.accentPalette('blue');
});