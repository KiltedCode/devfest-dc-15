/* plans module configuration */
angular.module('pt.plans', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/my-plan/:id',  {
        templateUrl     :   'views/my-plan-details.html',
        controller      :   'MyPlanDetailsCtrl'
    });
}]);