(function(angular) {
  'use strict';
  angular.module('deliveryApp.route', ['ionic'])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      resolve: {
        user: function(Account) {
          return Account.get();
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
      }
    });
    $urlRouterProvider.otherwise('/app/entry');
  });
})(angular);
