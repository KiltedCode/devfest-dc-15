/* hub Service.
 * 
 */
angular.module('pt.hub')
.factory('HubService', ['$http', function ($http) {
	return {
		getCurrentPlansSummary : function() {
			return $http.get('/app/data/my-plans-summary.json');
		},
		getAvailablePlans : function() {
			return $http.get('/app/data/available-plans.json');
		}
	}
}]);