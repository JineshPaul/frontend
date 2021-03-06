(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('retirementGoalsService', retirementGoalsService);

        retirementGoalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function retirementGoalsService($resource,$rootScope,appConfig,$q){
        	var modelObject = {};
            return{
        		getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                addRetirementGoal : addRetirementGoal,
                getCorpusEstimates : getCorpusEstimates
        	}
	        function getSavedValues(){  
                var retirementAnswers = {};
                var riskAnswers = {};
                retirementAnswers = $rootScope.userFlags['user_answers']['retirement'];
                riskAnswers = $rootScope.userFlags['user_answers']['assess']
                modelObject.A1 = retirementAnswers['goal_name'];
                modelObject.A2 = retirementAnswers['current_age'] || riskAnswers['A1'];
                modelObject.A3 = retirementAnswers['retirement_age'];
                modelObject.A4 = retirementAnswers['corpus'];
                modelObject.A6 = retirementAnswers['monthly_income'];
                modelObject.A8 = retirementAnswers['amount_saved'] || 0;
                modelObject.estimate_selection_type = retirementAnswers['estimate_selection_type'];
                modelObject.A5 = retirementAnswers['monthly_investment'];
                modelObject.sip = retirementAnswers['monthly_investment'];
                modelObject.corpus = retirementAnswers['corpus'];

                modelObject.assetAllocation = retirementAnswers['allocation'];
                return modelObject;
                
	        }
            function setSavedValues(value){  
                var modelObject = {};
                modelObject = value;
                sessionStorage.setItem('goalDetailsTemp', JSON.stringify(modelObject));
            }

            function addRetirementGoal(dataObj){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/retirement/new/response/add/', 
                    {}, {
                        Check: {
                            method:'POST',
                        }
                    });
                getAPI.Check(dataObj,function(data){
                    if(data.status_code == 200){
                        defer.resolve({'success':data.response});
                    }else{
                        defer.resolve({'Message':data.response['message']});
                    }               
                }, function(err){
                    defer.reject(err);
                }); 
                return defer.promise;
            }
            
            function getCorpusEstimates(currentAge, retirementAge, monthlyIncome, amountSaved) {
            	var queryData = {"monthly_income":monthlyIncome, "amount_saved":amountSaved, 
            			"current_age":currentAge,"retirement_age":retirementAge};
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/goal/retirement/estimate/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({"data" : queryData},function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;

            }
        }     
})();