(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('planInvestController',planInvestController);

		planInvestController.$inject = ['$scope','$rootScope','$location','planInvestService', 'userDetailsService', 'appConfig']
		function planInvestController($scope,$rootScope,$location,planInvestService,userDetailsService, appConfig){
			
			$rootScope.is_bank_supported = $rootScope.userFlags.user_flags.is_bank_supported;

			$scope.startGoalAdd = function(currentGoal) {
				$rootScope.currentGoal = currentGoal;
				var goalRedirect = '';
				if(currentGoal == 'invest') {
					goalRedirect = 'quickInvestStart';
				} else if(currentGoal == 'tax') {
					goalRedirect = 'taxsavingStarted';
				}
 				
				$location.path('/'+goalRedirect);
			}

			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
				});
			}

			$scope.callCompleteness();

			$scope.goalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.goalAnswered = {};
				appConfig.otherGoals.forEach(function(data) {
					console.log('user flags',user_flags[data]);
					$rootScope.goalAnswered[data] = user_flags[data];
				});
				console.log('goalAnswered',$rootScope.goalAnswered);
			}

			$scope.goalAnswered();

			$scope.financialGoalAnswered = function() {
				var user_flags = $rootScope.userFlags.user_flags;
				$rootScope.finGoalAnswered = '';
				appConfig.financialGoals.forEach(function(data) {
					if(user_flags[data] == true){
						$rootScope.finGoalAnswered = true;
					}
				});
			}

			$scope.financialGoalAnswered();
		}
})();