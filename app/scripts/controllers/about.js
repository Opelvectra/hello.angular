'use strict';

/**
 * @ngdoc function
 * @name angularSkeletonApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularSkeletonApp
 */
angular.module('angularSkeletonApp')
  .controller('AboutCtrl', ['$scope', '$battleground.engine.dbConnector', function ($scope, $battlegroundDBConnector) {
    $scope.battlegroundState = $battlegroundDBConnector.getBattleground(0);
    $scope.performAction = function(){
    	//TODO: to implement!
    }
  }]);
