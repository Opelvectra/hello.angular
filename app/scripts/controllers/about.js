'use strict';

/**
 * @ngdoc function
 * @name angularSkeletonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularSkeletonApp
 */
angular.module('angularSkeletonApp')
  .controller('AboutCtrl', ['$scope', '$battleground.engine.api', function ($scope, $battlegroundApi) {
    $scope.battlegroundState = $battlegroundApi.getBattlegroundState();
    $scope.performAction = function(){
    	var actBy = 0, targetId = 0, targetTeamId = 1,
    		actionId = 0;
    	$battlegroundApi.performAction(actBy, actionId, targetId, targetTeamId).then(function(result){
    		console.log('>> ' + result.message);
    		$scope.battlegroundState = result.battlegroundState;
    	});
    }
  }]);
