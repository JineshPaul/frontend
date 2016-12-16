(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('weddingController',weddingController);

		weddingController.$inject = ['$scope','$rootScope','$route','$location', '$timeout', 'weddingService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator'];
		function weddingController($scope,$rootScope,$route,$location,$timeout,weddingService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			
			this.scope = $scope;

			this.scope.wedding = {};
			this.goalModelObject = this.scope.wedding;
			
			this.scope.modelVal = weddingService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.timeout = $timeout,
			
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = weddingService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.callModel = angular.bind( this, this.callModel );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			this.scope.handleGoalEstimatesResponse = angular.bind( this, this.handleGoalEstimatesResponse);
			
			this.rootScope.showPortfolioFactoring = true;

			this.scope.changeDebtModal = angular.bind(this, this.changeDebtModal );
			this.scope.changeEquityModal = angular.bind(this, this.changeEquityModal );
			this.scope.saveEquityDebtMix = angular.bind(this, this.saveEquityDebtMix );
			this.scope.getFundData = angular.bind(this, this.getFundData );

			this.scope.getGoalGraphDetails = angular.bind(this, this.getGoalGraphDetails ); 
			this.scope.getGraphObject = angular.bind(this, this.getGraphObject ); 
            this.scope.graphObject = this.scope.getGraphObject();

			this.scope.calculateEstimates = function() {
				var self = this;
				weddingService.getCorpusEstimates($scope.wedding['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7, $scope.modelVal.A8)
				.then(self.handleGoalEstimatesResponse);
			}

			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['wedding']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['wedding']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 
			}

			if($location.$$path == '/weddingStarted'){
				$scope.loadDefaultValues();
			}
			
			this.scope.fundSelectionWedding = function(modelVal) {
				var self = this;
				console.log("In fund selection", modelVal);

				var d = new Date();
				var fundSelectionObj = {};
				if($rootScope.selectedCriteria == 'op1') {
					fundSelectionObj.corpus = modelVal.A3;
					fundSelectionObj.term = modelVal.A2 - d.getFullYear();
					fundSelectionObj.sip = modelVal.A4;
					fundSelectionObj.lumpsum = 0;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					},
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj',fundSelectionObj);
				}

				if($rootScope.selectedCriteria == 'op2') {
					fundSelectionObj.corpus = modelVal.A3;
					fundSelectionObj.term = modelVal.A2 - d.getFullYear();
					fundSelectionObj.sip = modelVal.A4;
					fundSelectionObj.lumpsum = 0;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					},
					fundSelectionObj.expected_people = modelVal.A5;
					fundSelectionObj.location = modelVal.A6;
					fundSelectionObj.sharing_percentage = modelVal.A7;
					
					fundSelectionObj.amount_saved = modelVal.A8;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.goal_plan_type = $rootScope.selectedCriteria;
					fundSelectionObj.goal_name = modelVal.A1;
					console.log('fundSelectionObj2', fundSelectionObj);
				}

				busyIndicator.show();
				goalsService.addParticularGoal(fundSelectionObj, 'wedding').then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						self.getFundData('wedding', busyIndicator);
						
					}
					else {
						console.log('Error in service');
					}
				});
			}
		}
		                               
		weddingController.prototype = finApp.goalControllerPrototype;

})();