(function() {
    'use strict';
    angular
        .module('finApp.auth')
        .factory('authService', authService);

        authService.$inject = ['$resource','$rootScope','appConfig','$q','riskService'];
        function authService($resource,$rootScope,appConfig,$q,riskService){
        	return{
        		verifyLogin : verifyLogin,
        		submitSuccess : submitSuccess
        	}

	        function verifyLogin(params){
				var defer = $q.defer();
				var postAPI = $resource( 
					appConfig.API_BASE_URL+'/user/login/', 
					{}, {
						Check: {
							method:'POST',
						}
					});
				postAPI.Check(params,function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message'], 'Error':data.error });
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
	        }

	        function submitSuccess(params){
        		var defer = $q.defer(); 
        		$rootScope.$broadcast('userloggedIn', params['success']);
					if(localStorage.getItem('riskData')){
						$rootScope.loggedIn = true;
						var riskData = JSON.parse(localStorage.getItem('riskData'));
						riskService.getAssesmentResult(riskData).then(function(data){
							if('success' in data){
								localStorage.removeItem('riskData');
							}
							defer.resolve({'success':'success'});
						});
					}
					else {
						defer.resolve({'success':'success'});
					}
				return defer.promise;
	        }
        }     
})();