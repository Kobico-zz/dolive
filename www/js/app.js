(function(angular) {
  'use strict';
  angular.module('deliveryApp', [
  'ionic',
  'ionic.service.core',
  'firebase',
  'ngCordova',
  'deliveryApp.services',   
  'deliveryApp.route',
  'deliveryApp.package',
  'deliveryApp.auth',
  'deliveryApp.settings'
  ])
  .controller('AppCtrl', function($rootScope, $scope, $ionicPlatform, $ionicModal, $timeout, Auth, Login, user) {
    $rootScope.user = user;
    $scope.showLogin = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {scope: null}).then(function(modal) {
        modal.show();
        $rootScope.loginModal = modal;
      });
    };
    $scope.logout = function() {
      Login.logout().then(function() {
        Login.authenticate();
      });
    };
  })
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      var push = new Ionic.Push({
        "debug": true
      });
      push.register(function(token) {
        console.log("Device token:",token.token);
      });
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
    Ionic.io();
  });
})(angular);
