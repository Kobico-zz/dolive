angular.module('deliveryApp')

.factory('Auth', function($firebaseAuth) {
	var ref = new Firebase('https://kobico-dolive.firebaseio.com/users');
	return $firebaseAuth(ref);
})
.factory('Packages', function($firebaseArray) {
	var ref = new Firebase('https://kobico-dolive.firebaseio.com/packages');
	return $firebaseArray(ref);
})
.factory('UserSettings', function($firebaseArray) {
	var ref = new Firebase('https://kobico-dolive.firebaseio.com/user-settings');
	return $firebaseArray(ref);
})
.service('LocationService',function($q,$cordovaGeolocation) {
	this.location = {};
	var GeoCoder = new google.maps.Geocoder();
    this.getAddress = function() {
    	return $q(function(resolve,reject) {
    		$cordovaGeolocation.getCurrentPosition({timeout:10000, enableHighAccuracy: true})
				.then(function(position) {
					this.location.pos = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					GeoCoder.geocode({location: this.location.pos}, function(result,status) {
						if(status!='OK') {
							resolve('הכתובת שלך');
						}
						resolve(result[0].formatted_address);
					});
				},function(error) {
					reject(error);
				});
	    });
    };
})
.service('Settings', function(Login, $firebaseObject, $q) {
	
	this.getUserSettings = function() {
		return $q(function(resolve,reject) {
			var defaultSettings = $firebaseObject(defaultSettingsRef);
			var defaultSettingsRef = new Firebase('https://kobico-dolive.firebaseio.com/defaultSettings');
			Auth.$onAuth(function(authData) {
				if(authData) {
					var userSettingsRef = new Firebase('https://kobico-dolive.firebaseio.com/settings/'+authData.uid);
					var userSettings = $firebaseObject(userSettingsRef);
					userSettings.$loaded(function(data) {
						if(data.package) {
							resolve(data);
						}
						else {
							defaultSettings.$loaded(function(data) {
								userSettings.package = data.package;
								userSettings.$save().then(function() {
									resolve(data);
								}).catch(function(err) {
									reject(err);
								});
								
							});
						}
					});
				} else {
					defaultSettings.$loaded(function(data) {
						resolve(data);
					});
				}
			});
		});
		
	};
})
.value('CameraOptions', {
		quality: 50,
		allowEdit: true,
		destinationType: 1,
		encodingType: 0,
		targetWidth: 100,
		targetHeight: 100,
		saveToPhotoAlbum: false,
});