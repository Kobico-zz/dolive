(function(angular) {
  'use strict';
	angular.module('deliveryApp.services',[])
	.factory('UserSettings', function($firebaseArray) {
		var ref = new Firebase('https://kobico-dolive.firebaseio.com/user-settings');
		return $firebaseArray(ref);
	})
	.service('LocationService',function($q,$cordovaGeolocation) {
		var GeoCoder = new google.maps.Geocoder();
	    this.getAddress = function() {
	    	return $q(function(resolve,reject) {
	    		$cordovaGeolocation.getCurrentPosition({timeout:10000, enableHighAccuracy: true})
					.then(function(position) {
						var location = {};
						location.pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
						GeoCoder.geocode({location: location.pos}, function(result,status) {
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
	.value('CameraOptions', {
			quality: 50,
			allowEdit: false,
			destinationType: 1,
			encodingType: 0,
			targetWidth: 100,
			targetHeight: 100,
			saveToPhotoAlbum: false,
	}).
	constant('FIREBASE_REFS', {
		defaultSettings: 'https://kobico-dolive.firebaseio.com/defaultSettings'
	});
})(angular);