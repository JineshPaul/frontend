(function(){
	'use strict';
	angular
		.module('finApp.dashboard',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/dashboard', {
				title : 'Dashboard',
		        templateUrl: 'modules/dashboard/views/dashboard.html',
		        controller: 'dashboardController'
		    })
		}
})();