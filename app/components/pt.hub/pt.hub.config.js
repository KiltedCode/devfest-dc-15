/* hub module configuration */
angular.module('pt.hub', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/hub',  {
        templateUrl     :   'views/hub.html',
        controller      :   'HubCtrl'
    });
}]);