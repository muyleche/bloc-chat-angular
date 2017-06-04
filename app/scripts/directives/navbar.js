(function() {
  function navbarCtrl($scope, $firebaseObject) {
    
  }

  angular
    .module('chatterBox')
    .directive('navigation', function() {
      return {
        restrict: 'AEC',
        scope: {},
        link: function() {},
        replace: true,
        templateUrl: '/templates/navbar.html',
        controller: ['$scope', '$firebaseObject', navbarCtrl]
      };
    });
})();
