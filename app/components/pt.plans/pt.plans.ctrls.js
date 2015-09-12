/* hub controller */
angular.module('pt.plans')
.controller('MyPlanDetailsCtrl', [ '$scope', '$routeParams', 'PlanService', function($scope, $routeParams, PlanService) {
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
			console.log('error', status);
		} );
}]);	