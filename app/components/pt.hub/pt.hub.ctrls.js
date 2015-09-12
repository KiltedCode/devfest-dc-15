/* hub controller */
angular.module('pt.hub')
.controller('HubCtrl', [ '$scope', '$mdDialog', '$mdToast', 'HubService', function($scope, $mdDialog, $mdToast, HubService) {
	$scope.model = {};
	$scope.model.myPlansSumm = [];
	$scope.model.availablePlans = [];
	$scope.model.planStartDate = '';
	$scope.model.startAP = null;
	
	HubService.getCurrentPlansSummary()
		.then(function(data, status) {
			$scope.model.myPlansSumm = data;
		}, function(error) {
			$mdToast.show(
		      $mdToast.simple()
		        .content('Error getting current plans. (HTTP-'+error.status+')')
		        .position('top right')
		        .hideDelay(3000)
		    );
		});

	HubService.getAvailablePlans()
		.then(function(data, status) {
			$scope.model.availablePlans = data;
		}, function(error) {
			$mdToast.show(
		      $mdToast.simple()
		        .content('Error getting available plans. (HTTP-'+error.status+')')
		        .position('top right')
		        .hideDelay(3000)
		    );
		} );

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
			preserveScope: true,
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

  	$scope.model.openRecordWorkout = function(ev, id, index) {
  		$scope.model.workoutShow = '';
  		$scope.model.workout = {};
  		$scope.model.workout.time = $scope.model.myPlansSumm[0].currentWeek[index].training.goal.time;
  		$scope.model.workout.distance = $scope.model.myPlansSumm[0].currentWeek[index].training.goal.distance;
	    $mdDialog.show({
			templateUrl: 'views/partials/dialog-workout.html',
			scope: $scope,
			parent: angular.element(document.body),
			preserveScope: true,
			targetEvent: ev,
			clickOutsideToClose:false
	    })
	    .then(function(action) {
	    	HubService.recordWorkout(index, action, $scope.model.workout)
	    		.then(function(data, status) {
					$scope.model.myPlansSumm = data;
				}, function(data, status) {
					$mdToast.show(
				    	$mdToast.simple()
				        .content('Error recording your workout. (HTTP-'+error.status+')')
				        .position('top right')
				        .hideDelay(3000)
				    );
				});
	    }, function() {
	    	
	    });
  	};

  	$scope.model.recordWorkout = function(action) {
  		if(action == 'cancel') {
			$mdDialog.cancel();
		} else {
  			$mdDialog.hide(action);
  		}
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
		$mdDialog.hide($scope.model.planStartDate);
	};
}]);
	