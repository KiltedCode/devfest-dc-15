/* plans Service.
 * 
 */
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