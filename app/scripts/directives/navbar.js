(function() {
  function navbarCtrl($scope, UserService, $firebaseArray) {
    let RoomService
    $scope.UserService = UserService;
    $scope.favorites ;
    $scope.$watch
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
        controller: ['$scope', 'UserService', '$firebaseArray', navbarCtrl]
      };
    });
})();
