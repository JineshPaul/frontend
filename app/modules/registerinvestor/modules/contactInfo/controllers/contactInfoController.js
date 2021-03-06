(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('contactInfoController',contactInfoController);

		contactInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','$timeout', 'contactInfoService','registerInvestorService','busyIndicator'];
		function contactInfoController($rootScope,$scope,$route,$http,$location,$timeout, contactInfoService, registerInvestorService,busyIndicator){
			this.scope = $scope;
			this.scope.modelVal = {communicationAddress: {}, permanentAddress: {}};

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			this.busyIndicator = busyIndicator;
			this.registerInvestorService = registerInvestorService;
			
			this.service = contactInfoService;
			
			var self = this;

			this.initialize();

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );
			
			this.lookupPincode = function(addressObject) {
				var self = this;
				self.busyIndicator.show();
				registerInvestorService.lookupPincode(addressObject.pincode).then(function(data){
					self.busyIndicator.hide();
					if('success' in data){
						addressObject.city = data['success']['city'];
						addressObject.state = data['success']['state'];
					}
				}, function() {
					self.busyIndicator.hide();
				});

			}

			this.scope.lookupPincode = angular.bind( this, this.lookupPincode );
			
			this.scope.getKYCStatus  = function(step) {
				return registerInvestorService.getKYCStatus();
			};

			this.redirectToMainPage = function() {
                $location.path($rootScope.redirectUrlContext);
			}
			
			this.scope.redirectToMainPage = angular.bind( this, this.redirectToMainPage );

			this.scope.onContinue  = function() {
				var step = $scope.getStep();
				if (step == 1) {
					$scope.appendValues($scope.modelVal);
					$scope.step=step+1;
					this.getKYCStatus()?0:$scope.reloadRoute('op2',1);
				}
				else if(step == 2) {
					$scope.appendValues($scope.modelVal);
					$scope.step=step+1;
					if ($rootScope.selectedCriteria == 'op1') {
						if (!this.getKYCStatus() && !$scope.modelVal.addressAreEqual) {
							$scope.reloadRoute('op3',3);							
						}						
					}
					else {
						this.saveCommunicationAddressImage();						
					}
				}
				else if(step == 3) {
					$scope.appendValues($scope.modelVal);
					$scope.step=step+1;
					if ($rootScope.selectedCriteria == 'op1') {
						this.saveInfo(true);
						//this.redirectToMainPage();
					}
					else {
						if (!this.getKYCStatus() && !$scope.modelVal.addressAreEqual) {
							$scope.reloadRoute('op3',3);			
						}
						else if ($rootScope.selectedCriteria == 'op3') {
							$scope.reloadRoute('op2',3);
						}
					}
				}
				else if(step == 4) {
					$scope.appendValues($scope.modelVal);
					$scope.step=step+1;
					if ($rootScope.selectedCriteria == 'op2') {
						this.saveInfo(true);
						//this.redirectToMainPage();
					}
					else {
						this.savePermanentAddressImage();
					}
				}
				else if(step == 5) {
					$scope.appendValues($scope.modelVal);
					this.saveInfo(true);
					//this.redirectToMainPage();
				}				
			};

			this.scope.onDisabled  = function() {
				var step = $scope.getStep(),
					disabled = false;
				if (step == 1) {
					if (!this.modelVal.communicationAddress.pincode||!this.modelVal.communicationAddress.addressLine1) {
						disabled = true;
					}
				}
				else if(step == 2) {
					if ($rootScope.selectedCriteria == 'op1') {
						if (!this.modelVal.addressAreEqual && (!this.modelVal.communicationAddress.pincode||!this.modelVal.communicationAddress.addressLine1)) {
							disabled = true;
						}
					}
					else {
						if (!this.modelVal.frontImageUrl || (this.needBackImage(this.modelVal.addressProofType) && !this.modelVal.backImageUrl)) {
							disabled = true;
						}
					}
				}
				else if(step == 3) {
					if ($rootScope.selectedCriteria == 'op1') {
						if (!this.modelVal.phoneNumber||!this.modelVal.email) {
							disabled = true;
						}					
					}
					else {
						if (!this.modelVal.addressAreEqual && (!this.modelVal.communicationAddress.pincode||!this.modelVal.communicationAddress.addressLine1)) {
							disabled = true;
						}
					}
				}
				else if(step == 4) {
					if ($rootScope.selectedCriteria == 'op2') {
						if (!this.modelVal.phoneNumber||!this.modelVal.email) {
							disabled = true;
						}					
					}
					else {
						if (!this.modelVal.permanentFrontImageUrl || (this.needBackImage(this.modelVal.permanentAddressProofType) && !this.modelVal.permanentBackImageUrl)) {
							disabled = true;
						}
					}
				}
				else if(step == 5) {
					if (!this.modelVal.phoneNumber||!this.modelVal.email) {
						disabled = true;
					}					
				}				

				return disabled;
			}
			//this.scope.getKYCStatus = angular.bind( this, this.getKYCStatus );
			
			var Bank_Statement = 5,
	        	Utility_Bill = 6,
	        	Ration_Card = 7;
			
			this.scope.needBackImage = function(addressProofType) {
				if (addressProofType == Bank_Statement || addressProofType == Utility_Bill || 
						addressProofType == Ration_Card) {
					return false;
				}
				return true;
			};

			this.saveCommunicationAddressImage = function() {
				var self = this;
				if (self.scope['frontImageUrl']) {
					self.busyIndicator.show();
					self.service.uploadFileToServer('address_proof_type', self.scope.modelVal.addressProofType, 'front_image', self.scope['frontImageUrl']).then(function(data) {
						self.busyIndicator.hide();
						if('success' in data){
							if (self.scope['backImageUrl']) {
								self.busyIndicator.show();
								self.service.uploadFileToServer('address_proof_type', self.scope.modelVal.addressProofType, 'back_image', self.scope['backImageUrl']).then(function() {
									self.busyIndicator.hide();
								}, function() {self.busyIndicator.hide();} );
							}
						}
					}, function() {
						self.busyIndicator.hide();
					});
				}
			};

			this.scope.saveCommunicationAddressImage = angular.bind( this, this.saveCommunicationAddressImage );

			this.savePermanentAddressImage = function() {
				var self = this;
				if (self.scope['permanentFrontImageUrl']) {
					self.busyIndicator.show();
					self.service.uploadFileToServer('permanent_address_proof_type', self.scope.modelVal.permanentAddressProofType, 'permanent_front_image', self.scope['permanentFrontImageUrl']).then(function(data) {
						self.busyIndicator.hide();
						if('success' in data){
							
							if (self.scope['permanentBackImageUrl']) {
								self.busyIndicator.show();
								self.service.uploadFileToServer('permanent_address_proof_type', self.scope.modelVal.permanentAddressProofType, 'permanent_back_image', self.scope['permanentBackImageUrl']).then(function() {
									self.busyIndicator.hide();
								}, function() {self.busyIndicator.hide();} );
							}
						}
					}, function() {
						self.busyIndicator.hide();
					});
				}
			}
			
			this.scope.savePermanentAddressImage = angular.bind( this, this.savePermanentAddressImage);

		}
		
		contactInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();