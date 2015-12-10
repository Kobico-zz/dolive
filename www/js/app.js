(function(angular) {
  'use strict';
  angular.module('deliveryApp', [
  'ionic',
  'ionic.service.core',
  'firebase',
  'ngCordova',
  'deliveryApp.package',
  'deliveryApp.auth'
  ])
  .controller('AppCtrl', function($rootScope, $scope, $ionicPlatform, $ionicModal, $timeout, Auth, Login, authData) {
    $rootScope.authData = authData;
    $rootScope.$watch('authData',function(v) {
      console.log(v);
    });
    $scope.showLogin = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {scope: null}).then(function(modal) {
        modal.show();
        $rootScope.loginModal = modal;
      });
    };
    $scope.logout = function() {
      Auth.$unauth();
      $scope.authData = null;
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
  })

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider

      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      resolve: {
        authData: function(Login) {
          return Login.authenticate();
        }
      }
    })
    .state('app.entry', {
      url: '/entry',
      views: {
        'menuContent': {
          templateUrl: 'templates/entry.html'
        }
      }
    })
    .state('app.newpackage', {
      url: '/newpackage',
      views: {
        'menuContent': {
          templateUrl: 'templates/newpackage.html',
          controller: 'NewpackageCtrl'
        }
      },
      resolve: {
        userSettings: function(Settings) {
          return Settings.getUserSettings();
        }
      }
    });
    $urlRouterProvider.otherwise('/app/entry');
  });
})(angular);
