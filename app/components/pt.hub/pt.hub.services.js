/* hub Service.
 * 
 */
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