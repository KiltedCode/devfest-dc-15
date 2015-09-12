/* plans Service.
 * 
 */
angular.module('pt.plans')
.factory('PlanService', ['$http', '$q', '$sessionStorage', function ($http, $q, $sessionStorage) {
	return {
		getPlanDetails : function(id) {
			var deferred = $q.defer();
			if(!$sessionStorage['plan-'+id]) {
				console.log('no storage');
				$http.get('/app/data/plan-'+id+'.json')
					.success(function(data) {

						console.log('summ', $sessionStorage.summ);
						if($sessionStorage.summ && $sessionStorage.summ[id]) {
							var summ = $sessionStorage.summ[id][0];
							console.log('summ', summ);
							data.weeks[summ.week-1] = summ.currentWeek;
						}
						$sessionStorage['plan-'+id] = data;
						deferred.resolve(data);
					});
			} else {
				console.log('plan', $sessionStorage['plan-'+id]);
				var plan = $sessionStorage['plan-'+id];
				console.log('summ', $sessionStorage.summ[id]);
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