(function(angular) {
  'use strict';
	angular.module('deliveryApp.settings',[])
	.service('Settings', function(FIREBASE_REFS, $firebaseObject, $q, $http) {
		this.getUserSettings = function(user) {
			var defaultSettings = $firebaseObject(new Firebase(FIREBASE_REFS.defaultSettings));
			var account = $firebaseObject(new Firebase('https://kobico-dolive.firebaseio.com/account/'+user.uid));
			return $q(function(resolve,reject) {
				account.$loaded().then(function(accountData) {
					if(accountData.isSet) {
						resolve(accountData.settings);
					}
					else {
						defaultSettings.$loaded().then(function(settings) {
							accountData.isSet = true;
							accountData.settings = settings;
							accountData.$save().then(function(data) {
								resolve(data.settings);
							});		
						})
						.catch(function() {
							$http.get('json/defaultSettings').then(function(settings) {
								resolve(settings.data);					
							})
							.catch(function(error) {
								reject(error);
							});
						});
					}
				});				
			});
		};
	});
})(angular);