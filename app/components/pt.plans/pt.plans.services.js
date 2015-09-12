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
		}
	}
}]);