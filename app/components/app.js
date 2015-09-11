'use strict';

angular.module('pt', ['ngRoute', 'pt.nav', 'pt.hub', 'angularMoment', 'ngMaterial'])
.run(['$rootScope', function($rootScope) {
	

}]);

angular.module('pt')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/',  {
        redirectTo      :   '/hub'
    });
    $routeProvider.otherwise({redirectTo: '/404'});
}])
.config(function($mdThemingProvider) {
  	$mdThemingProvider.theme('default')
    	.primaryPalette('orange')
    	.accentPalette('blue');
});