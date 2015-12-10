(function(angular) {
  'use strict';
  angular.module('deliveryApp.auth', [])
  .controller('AuthCtrl',function($rootScope, Login) {
    this.errors = [];
    $rootScope.$on('login:success', function(e,data) {
      $rootScope.authData = data.user;
    });
    $rootScope.$on('login:failure', function(e,data) {
      errors.push(data.error);
    });
    this.login = function(creds) {
      Login.localLogin(creds).then(function(authData) {
        $rootScope.$broadcast('login:success',{user: authData});
        $rootScope.loginModal.hide();
      }).catch(function(err) {
        $rootScope.$broadcast('login:failure',{error: err});
      });
    };
    this.facebookLogin = function() {
      Login.facebookLogin().then(function(authData) {
        $rootScope.$broadcast('login:success',{user: authData});
        $rootScope.loginModal.hide();
      }).catch(function(err) {
        $rootScope.$broadcast('login:failure',{error: err});
      });
    };
    this.googleLogin = function() {
      Login.googleLogin().then(function(authData) {
        $rootScope.$broadcast('login:success',{user: authData});
        $rootScope.loginModal.hide();
      }).catch(function(err) {
        $rootScope.$broadcast('login:failure',{error: err});
      });
    };
    this.close = function() {
      $rootScope.loginModal.hide();
    };
  })
  .service('Login', function($ionicModal, $timeout, Auth, $q) {
    this.authenticate = function() {
      return $q(function(resolve, reject) {
        Auth.$onAuth(function(authData) {
          if(authData) {
            resolve(authData);
          }
          else {
            Auth.$authAnonymously().then(function(authData) {
              resolve(authData);
            }).catch(function(error) {
              reject(error);
            });
          } 
        });
      });
    };
    this.localLogin = function(creds) {
      return $q(function(resolve, reject) {
        Auth.$authWithPassword(creds).then(function(authData) {
          resolve(authData);
        }).catch(function(err) {
          Auth.$createUser(creds).then(function(authData) {
            Auth.$authWithPassword(creds).then(function(authData) {
              resolve(authData);
            }).catch(function(err) {
              reject(err);
            });

          }).catch(function(err) {
            reject(err);
          });
        });
      });
    };
    this.facebookLogin = function() {
      return $q(function(resolve, reject) {
        Auth.$authWithOAuthPopup('facebook').then(function(authData) {
          resolve(authData);
        }).catch(function(err) {
          reject(err);
        });
      });
    };
    this.googleLogin = function() {
      return $q(function(resolve, reject) {
        Auth.$authWithOAuthPopup('google').then(function(authData) {
          resolve(authData);
        }).catch(function(err) {
          reject(err);
        });
      });
    };
    this.logout = function() {
      Auth.$unauth();
    };
  });
})(angular);
