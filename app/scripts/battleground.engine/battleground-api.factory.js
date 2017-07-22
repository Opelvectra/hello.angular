angular
  .module('battleground.engine')
  .factory('$battleground.engine.api', ['$q', '$battleground.engine.dbConnector', '$battleground.engine.actionPerformer', function($q, $battlegroundDBConnector, $battlegroundActionPerformer){
	  return {
		  getBattlegroundState: function(){
			  return $battlegroundDBConnector.getBattleground(0);
		  },
		  performAction: function(unitId, actionId, targetId, targetTeamId){
			  var defer = $q.defer();
			  $battlegroundActionPerformer.performAction(unitId, actionId, targetId, targetTeamId).then(function(result){
				  defer.resolve(result);
			  });
			  return defer.promise;
		  }
	  }
  }]);