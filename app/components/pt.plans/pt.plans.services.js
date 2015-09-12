/* plans Service.
 * 
 */
angular.module('pt.plans')
.factory('PlanService', ['$http', function ($http) {
	return {
		getPlanDetails : function(id) {
			return $http.get('/app/data/plan-'+id+'.json');
		}
	}
}]);