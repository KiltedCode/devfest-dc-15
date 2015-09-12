/* hub controller */
angular.module('pt.plans')
.controller('MyPlanDetailsCtrl', [ '$scope', '$mdDialog', '$mdToast', '$routeParams', 'PlanService', function($scope, $mdDialog, $mdToast, $routeParams, PlanService) {
	$scope.model = {};
	var planId = $routeParams.id;
	$scope.model.mp = {};
	$scope.model.weekNum = 0;
	
	PlanService.getPlanDetails(planId)
		.then(function(data, status) {
			$scope.model.mp = data;
			var dateTS = data.startDate;
			$scope.model.mp.weeks = _.map(data.weeks, function(week) {
				return _.map(week, function(day){
					day.date = dateTS;
					dateTS+=86400000;
					return day;
				});
			});
			$scope.model.weekNum = $scope.model.mp.week - 1;
		}, function(data, status) {
			$mdToast.show(
		    	$mdToast.simple()
			        .content('Error getting plan. (HTTP-'+error.status+')')
			        .position('top right')
			        .hideDelay(3000)
		    );
		} );

	$scope.model.openRecordWorkout = function(ev, id, index) {
  		$scope.model.workoutShow = '';
  		$scope.model.workout = {};
  		var training = $scope.model.mp.weeks[$scope.model.weekNum][index].training;
  		$scope.model.workout.time = training.goal.time;
  		$scope.model.workout.distance = training.goal.distance;
	    $mdDialog.show({
			templateUrl: 'views/partials/dialog-workout.html',
			scope: $scope,
			parent: angular.element(document.body),
			preserveScope: true,
			targetEvent: ev,
			clickOutsideToClose:false
	    })
	    .then(function(action) {
	    	PlanService.recordWorkout(id, index, action, $scope.model.workout)
	    		.then(function(data, status) {
					$scope.model.mp = data;
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