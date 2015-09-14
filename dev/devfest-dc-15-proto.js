/* devfest-dc-15-proto - v0.1.0 - 2015-09-12 */
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
angular.module('pt.hub', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/hub',  {
        templateUrl     :   'views/hub.html',
        controller      :   'HubCtrl'
    });
}]);
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
	
angular.module('pt.hub')
.factory('HubService', ['$http', '$q', '$sessionStorage', function ($http, $q, $sessionStorage) {
	return {
		getCurrentPlansSummary : function() {
			var deferred = $q.defer();
			if(!$sessionStorage.mps) {
				$http.get('/app/data/my-plans-summary.json')
					.success(function(data) {
						$sessionStorage.mps = data;
						$sessionStorage.summ = _.groupBy(data, 'trainingId');
						deferred.resolve(data);
					});
			} else {
				deferred.resolve($sessionStorage.mps);
			}
			return deferred.promise;
		},
		getAvailablePlans : function() {
			var deferred = $q.defer();
			if(!$sessionStorage.ap) {
				$http.get('/app/data/available-plans.json')
					.success(function(data) {
						$sessionStorage.ap = data;
						deferred.resolve(data);
					});
			} else {
				deferred.resolve($sessionStorage.ap);
			}
			return deferred.promise;
		},
		recordWorkout : function(index, action, workout) {
			var deferred = $q.defer();
			var mps = $sessionStorage.mps;
			if(action=='hit') {
    			var training = angular.copy(mps[0].currentWeek[index].training);
    			training.recorded = true;
    			training.success = true;
    			if(workout.time != '' && workout.distance != '') {
    				training.actual = {
    					time : workout.time,
    					distance : workout.distance
    				}
    			}
    			mps[0].currentWeek[index].training = training;
	    	} else if(action=='miss') {
	    		mps[0].currentWeek[index].training.recorded = true;
	    	} else if(action=='bump') {
	    		var bumpTraining = angular.copy(mps[0].currentWeek[index].training);
	    		mps[0].currentWeek[index].training = false;
	    		if(index < mps[0].currentWeek.length - 1) {
	    			mps[0].currentWeek[index+1].training = bumpTraining;
	    		}
	    	}
	    	$sessionStorage.mps = mps;
	    	$sessionStorage.summ = _.groupBy(mps, 'trainingId');
	    	deferred.resolve(mps);

	    	return deferred.promise;
		}
	}
}]);
angular.module('pt.nav', []);
angular.module('pt.nav')
.controller('NavCtrl', ['$scope', '$mdSidenav', '$mdUtil', function($scope, $mdSidenav, $mdUtil) {
	$scope.navModel = {};
	$scope.navModel.currentPage = 'Your Training';

	var buildToggler = function(navId) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navId).toggle();
          },200);

      return debounceFn;
    };
	
	$scope.navModel.toggleLeft = buildToggler('left');

}]);	
angular.module('pt.plans', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/my-plan/:id',  {
        templateUrl     :   'views/my-plan-details.html',
        controller      :   'MyPlanDetailsCtrl'
    });
}]);
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
angular.module('pt.plans')
.factory('PlanService', ['$http', '$q', '$sessionStorage', function ($http, $q, $sessionStorage) {
	return {
		getPlanDetails : function(id) {
			var deferred = $q.defer();
			if(!$sessionStorage['plan-'+id]) {
				$http.get('/app/data/plan-'+id+'.json')
					.success(function(data) {
						if($sessionStorage.summ && $sessionStorage.summ[id]) {
							var summ = $sessionStorage.summ[id][0];
							data.weeks[summ.week-1] = summ.currentWeek;
						}
						$sessionStorage['plan-'+id] = data;
						deferred.resolve(data);
					});
			} else {
				var plan = $sessionStorage['plan-'+id];
				if($sessionStorage.summ && $sessionStorage.summ[id]) {
					var summ = $sessionStorage.summ[id][0];
					plan.weeks[summ.week-1] = summ.currentWeek;
				}
				$sessionStorage['plan-'+id] = plan;
				deferred.resolve(plan);
			}
			return deferred.promise;
		},
		recordWorkout : function(id, index, action, workout) {
			var deferred = $q.defer();
			// var mps = $sessionStorage.mps;
			var plan = $sessionStorage['plan-'+id];
			var currWeek = plan.weeks[plan.week-1];
			if(action=='hit') {
    			var training = angular.copy(currWeek[index].training);
    			training.recorded = true;
    			training.success = true;
    			if(workout.time != '' && workout.distance != '') {
    				training.actual = {
    					time : workout.time,
    					distance : workout.distance
    				}
    			}
    			currWeek[index].training = training;
	    	} else if(action=='miss') {
	    		currWeek[index].training.recorded = true;
	    	} else if(action=='bump') {
	    		var bumpTraining = angular.copy(currWeek[index].training);
	    		currWeek[index].training = false;
	    		if(index < currWeek.length - 1) {
	    			currWeek[index+1].training = bumpTraining;
	    		} else {
	    			if(plan.week <= plan.weeks.length) {
	    				plan.weeks[plan.week][0].training = bumpTraining;
	    			}
	    		
	    		}
	    	}
	    	$sessionStorage['plan-'+id] = plan;
	    	var mps = null;
	    	if($sessionStorage.mps && $sessionStorage.mps[0].trainingId == id) {
	    		mps = $sessionStorage.mps;
	    		mps.currentWeek = plan.weeks[plan.week-1];
	    	} else {
	    		mps = [angular.copy(plan)];
	    		mps[0].currentWeek = plan.weeks[plan.week-1];
	    		delete mps[0].weeks;
	    	}
    		$sessionStorage.mps = mps;
    		$sessionStorage.summ = _.groupBy(mps, 'trainingId');
	    	

	    	deferred.resolve(plan);

	    	return deferred.promise;
		}
	}
}]);