/* hub controller */
angular.module('pt.hub')
.controller('HubCtrl', [ '$scope', '$mdDialog', 'HubService', function($scope, $mdDialog, HubService) {
	$scope.model = {};
	$scope.model.myPlansSumm = [];
	$scope.model.availablePlans = [];
	$scope.model.planStartDate = '';
	$scope.model.startAP = null;
	
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

	var startPlan = function(id, startDate) {
		//TODO: save to current plans
	};

	$scope.model.getStarted = function(ev, id, index) {
		$scope.model.startAP = $scope.model.availablePlans[index];
	    $mdDialog.show({
			controller: 'GetStartedCtrl',
			templateUrl: 'views/partials/dialog-get-started.html',
			scope: $scope,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false
	    })
	    .then(function(startDate) {
	    	if(startDate != null) {
	    		startPlan(id, startDate);
	    	}
	    }, function() {
	    	
	    });
  	};
	

}]);

angular.module('pt.hub')
.controller('GetStartedCtrl', [ '$scope', '$mdDialog', 'HubService', function($scope, $mdDialog, HubService) {
	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	$scope.start = function() {
		console.log('start', $scope.model.planStartDate);
		$mdDialog.hide($scope.model.planStartDate);
	};
}]);	