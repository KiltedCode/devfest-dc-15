/* hub controller */
angular.module('pt.hub')
.controller('HubCtrl', [ '$scope', 'HubService', function($scope, HubService) {
	$scope.model = {};
	$scope.model.myPlansSumm = [];
	$scope.model.availablePlans = [];
	
	HubService.getCurrentPlansSummary()
		.success(function(data, status) {
			$scope.model.myPlansSumm = data;
		})
		.error(function(data, status) {
			//TODO: error handling
			console.log('error', status);
		});

	HubService.getAvailablePlans()
		.success(function(data, status) {
			$scope.model.availablePlans = data;
		})
		.error(function(data, status) {
			//TODO: error handling
			console.log('error', status);
		});
}]);	