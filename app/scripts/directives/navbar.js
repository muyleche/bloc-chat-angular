(function() {
  function navbarCtrl($scope, UserService) {
    $scope.UserService = UserService;
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
        controller: ['$scope', 'UserService', navbarCtrl]
      };
    });
})();
