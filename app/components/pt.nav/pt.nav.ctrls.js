/* nav controller */
angular.module('pt.nav')
.controller('NavCtrl', ['$scope', '$mdSidenav', '$mdUtil', function($scope, $mdSidenav, $mdUtil) {
	$scope.navModel = {};
	$scope.navModel.currentPage = 'The Hub';

	var buildToggler = function(navId) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navId).toggle();
          },200);

      return debounceFn;
    };
	
	$scope.navModel.toggleLeft = buildToggler('left');

}]);	