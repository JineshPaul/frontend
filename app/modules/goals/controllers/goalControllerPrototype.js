var finApp = finApp || {};
(function(){
	'use strict';

	finApp.goalControllerPrototype = {
			showEquityModal: function(){
				$('#equiDeptModal').modal('show');
			},
			
			reloadRoute : function(param) {
				this.rootScope.selectedCriteria = param;
				if(!this.rootScope.$$phase) this.rootScope.$apply();
				this.rootScope.slideTobeChanged = 2;
			    this.route.reload();
			},
			
			appendValues : function(value){
				this.goalTypeService.setSavedValues(value);
			},
			
			getAssetAllocationCategory : function(){
				var currentYear = new Date(),
					tenure = this.scope.modelVal.A2 - currentYear.getFullYear(),
					self = this;
				
				this.goalModelObject['tenure'] = tenure;
				
				this.assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
					if('success' in data){
						console.log("Success asset category: " + data.success['asset_allocation_category']);
						self.goalModelObject['assetAllocationCategory'] = data.success['asset_allocation_category'];
					}
					else {
						self.goalModelObject['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					self.scope.$broadcast('assetAllocationCategoryChanged');
				});

			},
			
			calculateRecommendedSIP : function(corpus) {
				var self = this;
				
				var calculateSIP = function() {
					var computedSIPData = self.goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': self.goalModelObject['tenure'] }, self.goalModelObject['assetAllocationCategory']);
					self.goalModelObject['perMonth'] = computedSIPData.computedSIP;
					self.goalModelObject['assetAllocation'] = computedSIPData.assetAllocation;
					self.scope.modelVal.A4 = self.scope.modelVal.A4 || self.goalModelObject['perMonth']; 
					self.goalModelObject['corpus'] = corpus;
				};
				
				if (!this.goalModelObject['assetAllocationCategory']) {
					this.scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
			},
			
			calculateCorpus : function(sipAmount) {
				var self  = this;
				
				var calculateCorpus = function() {
					var computedSIPData = self.goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'tenure': self.goalModelObject['tenure'] }, self.goalModelObject['assetAllocationCategory']);
					self.goalModelObject['corpus'] = computedSIPData.computedCorpus;
					self.goalModelObject['assetAllocation'] = computedSIPData.assetAllocation;
					console.log("calculateCorpus: " + JSON.stringify(computedSIPData.assetAllocation) + " corpus: " + computedSIPData.computedCorpus);
				};
				
				if (this.scope.modelVal.A4 == this.goalModelObject.perMonth)
					return;
				
				if (!this.goalModelObject['assetAllocationCategory']) {
					this.scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
			},
			
			estimateSelectionChanged : function(selectionType) {
				this.scope.modelVal.A3 = this.goalModelObject.goalEstimates[selectionType].corpus;
				this.scope.modelVal.A4 = this.goalModelObject.goalEstimates[selectionType].sip;
				this.goalModelObject['corpus'] = this.goalModelObject.goalEstimates[selectionType].corpus;
				this.goalModelObject['perMonth'] = this.goalModelObject.goalEstimates[selectionType].sip;
				this.goalModelObject['assetAllocation'] = this.goalModelObject.goalEstimates[selectionType].assetAllocation;
			}
			
	};
})();