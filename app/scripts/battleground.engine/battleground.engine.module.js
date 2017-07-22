angular
  .module('battleground.engine', [])
  .factory('$battleground.engine.dbTables.battleUnits', function(){
	  return [{
		  id: 0,
		  name: 'Test Player',
		  team: 0,
		  number: 0,
		  battlegroundId: 0,
		  testValue: 100
	  }, {
		  id: 1,
		  name: 'Test Dummy',
		  team: 1,
		  number: 0,
		  battlegroundId: 0,
		  testValue: 10000
	  }];
  })
  .factory('$battleground.engine.dbTables.battleground', function(){
	  return [{
		  id: 0,
		  description: 'test battle with dummy',
		  currentTeam: 0
	  }];
  })
  .factory('$battleground.engine.dbConnector', ['$battleground.engine.dbTables.battleground', 
	  		'$battleground.engine.dbTables.battleUnits', function(battlegroundTable, battleUnitsTable){
	  return {
		  getBattleground: function(id){
			  var battlegroundData = battlegroundTable.filter(function(battleground){
				  return battleground.id === id;
			  })[0];
			  var battleUnits = battleUnitsTable.filter(function(battleUnit){
				  return battleUnit.battlegroundId === id;
			  });
			  var result = angular.copy(battlegroundData);
			  result.battleUnits = angular.copy(battleUnits);
			  return result;
		  }
	  }
  }])
  .factory('$battleground.engine.api', ['$q', '$battleground.engine.dbConnector', function($q, $battlegroundDBConnector){
	  return {
		  getBattlegroundState: function(){
			  return $battlegroundDBConnector.getBattleground(0);
		  },
		  performAction: function(unitId, actionId, targetId, targetTeamId){
			  var defer = $q.defer();
			  defer.resolve({
				  message: 'Action #' + actionId + ' performed by ' + unitId + ' to ' + targetId + ' from team #' + targetTeamId,
				  battlegroundState: $battlegroundDBConnector.getBattleground(0)
			  });
			  return defer.promise;
		  }
	  }
  }]);