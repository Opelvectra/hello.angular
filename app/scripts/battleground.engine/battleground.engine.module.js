angular
  .module('battleground.engine', [])
  .factory('$battleground.engine.dbTables.battleUnits', function(){
	  return [{
		  id: 0,
		  name: 'Test Player',
		  team: 0,
		  number: 0,
		  battlegroundId: 0,
		  testValue: 100,
		  skills: [30, 150, 210, 320]
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
  .factory('$battleground.engine.actionPerformer', ['$q', '$battleground.engine.dbConnector', function($q, $battlegroundDBConnector){
	  return {
		  performAction: function(unitId, actionId, targetId, targetTeamId){
			  var defer = $q.defer();
			  var unitTeamId = 0, battlegroundId = 0, // TODO: later these will be taken using Security Token;
			      battleground = $battlegroundDBConnector.getBattleground(0),
			      actorUnit = battleground.battleUnits.filter(function(battleUnit){
					  return battleUnit.team === unitTeamId && battleUnit.number === unitId;
				  })[0],
				  targetUnit = battleground.battleUnits.filter(function(battleUnit){
					  return battleUnit.team === targetTeamId && battleUnit.number === targetId;
				  })[0],
			      result = {};
			  if(!isTeamCanAct(unitTeamId, battleground, result) ||
					  !isUnitCanAct(unitId, battleground, result) ||
					  !isTargetAvailable(targetUnit, result) ||
					  !isActionAvailable(actorUnit, actionId, result)){
				  defer.resolve(result);
			  } else {
				  result.message = 'Action #' + actionId + ' performed by ' + unitId + ' to ' + targetId + ' from team #' + targetTeamId;
				  result.battlegroundState = $battlegroundDBConnector.getBattleground(0);
				  defer.resolve(result);
			  }
			  return defer.promise;
		  }
	  }
	  
	  function isTeamCanAct(unitTeamId, battleground, result){
		  if(unitTeamId === battleground.id){
			  return true;
		  } else {
			  result.errorCode = 1;
			  result.errorMessage = 'Your team cant move right now';
			  return false;
		  }
	  }
	  
	  function isUnitCanAct(unitId, battleground, result){
		  var isCanAct = true;// TODO: Later here we will check if unit is stunned
		  if(isCanAct){
			  return true;
		  } else {
			  result.errorCode = 2;
			  result.errorMessage = 'Your unit cant move right now';
			  return false;
		  }
	  }
	  
	  function isActionAvailable(actorUnit, actionId, result){
		  var actionMeta = actorUnit.skills[actionId];
		  if(actionMeta){
			  console.log(actionMeta);
			  return true;
		  } else {
			  result.errorCode = 3;
			  result.errorMessage = 'Your skill is unavailable';
			  return false;
		  }
	  }
	  
	  function isTargetAvailable(targetUnit, result){
		  var isCanAct = true;// TODO: Later here we will check if unit can be a target
		  if(isCanAct){
			  return true;
		  } else {
			  result.errorCode = 4;
			  result.errorMessage = 'Your target is not available';
			  return false;
		  }
	  }
  }])
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