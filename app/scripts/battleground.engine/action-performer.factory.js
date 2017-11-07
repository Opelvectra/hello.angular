angular
  .module('battleground.engine')
  .factory('$battleground.engine.actionPerformer.validation', [function(){
	  return {
		  isTeamCanAct: function (unitTeamId, battleground, result){
			  if(unitTeamId === battleground.id){
				  return true;
			  } else {
				  result.errorCode = 1;
				  result.errorMessage = 'Your team cant move right now';
				  return false;
			  }
		  },
		  isUnitCanAct: function(unitId, battleground, result){
			  var isCanAct = true;// TODO: Later here we will check if unit is stunned
			  if(isCanAct){
				  return true;
			  } else {
				  result.errorCode = 2;
				  result.errorMessage = 'Your unit cant move right now';
				  return false;
			  }
		  },
		  isActionAvailable: function(actorUnit, actionId, result){
			  var actionMeta = actorUnit.skills[actionId];
			  if(actionMeta){
				  console.log(actionMeta);
				  return true;
			  } else {
				  result.errorCode = 3;
				  result.errorMessage = 'Your skill is unavailable';
				  return false;
			  }
		  },
		  isTargetAvailable: function(targetUnit, result){
			  var isCanAct = true;// TODO: Later here we will check if unit can be a target
			  if(isCanAct){
				  return true;
			  } else {
				  result.errorCode = 4;
				  result.errorMessage = 'Your target is not available';
				  return false;
			  }
		  }
	  };
  }])
  .factory('$battleground.engine.actionPerformer', ['$q', '$battleground.engine.dbConnector', '$battleground.engine.actionPerformer.validation', function($q, $battlegroundDBConnector, $bgValidation){
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
				  skillMeta = $battlegroundDBConnector.getSkillMeta(actorUnit.skills[actionId]),
			      result = {};
			  if(!$bgValidation.isTeamCanAct(unitTeamId, battleground, result) ||
					  !$bgValidation.isUnitCanAct(unitId, battleground, result) ||
					  !$bgValidation.isTargetAvailable(targetUnit, result) ||
					  !$bgValidation.isActionAvailable(actorUnit, actionId, result)){
				  defer.resolve(result);
			  } else {
				  performSkill({
					  skillMeta: skillMeta,
					  actorUnit: actorUnit,
					  targetUnit: targetUnit,
					  targetTeamId: unitTeamId === 0 ? 1 : 0, // TODO: for now it's enough, will improve it later
					  battleground: battleground
				  });
				  $battlegroundDBConnector.saveBattleground(battleground);
				  result.message = 'Action #' + actionId + ' performed by ' + unitId + ' to ' + targetId + ' from team #' + targetTeamId + '. ' + skillMeta.description;
				  result.battlegroundState = $battlegroundDBConnector.getBattleground(0);
				  defer.resolve(result);
			  }
			  return defer.promise;
		  }
	  }
	  
	  function performSkill(options){
		  console.log(options);
		  if(options.skillMeta.toTarget){
			  if(options.skillMeta.toTarget.testValue){
				  options.targetUnit.testValue += options.skillMeta.toTarget.testValue;
			  } 
		  }
	  }
  }])
  .factory('$battleground.engine.dbTables.skills', function(){
	  return [{
		  id: 30,
		  description: 'skill #30, simple physic attack',
		  toTarget: {
			  testValue: -150
		  }
	  }];
  });