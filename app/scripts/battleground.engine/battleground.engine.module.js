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
	  		'$battleground.engine.dbTables.battleUnits', '$battleground.engine.dbTables.skills', function(battlegroundTable, battleUnitsTable, skillsTable){
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
		  },
      saveBattleground: function (battleground) {
        var battlegroundData = battlegroundTable.filter(function (battlegroundOrigin) {
          return battleground.id === battlegroundOrigin.id;
        })[0];
        var battleUnits = battleUnitsTable.filter(function (battleUnit) {
          return battleUnit.battlegroundId === battleground.id;
        });
        battlegroundData.currentTeam = battleground.currentTeam;
        battleground.battleUnits.forEach(function (elem, index) {
          battleUnitsTable[index] = elem;
        });
        console.log(battleground);
      },
		  getSkillMeta: function(id){
			  var skillsMeta = skillsTable.filter(function(skill){
				  return skill.id === id;
			  })[0];
			  return skillsMeta;
		  }
	  };
  }]);
