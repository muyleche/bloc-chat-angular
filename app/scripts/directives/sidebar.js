(function(){
  function sidebarCtrl($scope, RoomService, UserService) {
    $scope.RoomService = RoomService;
    $scope.UserService = UserService;
    $scope.favoritesFirst = (current, next) => {
      return UserService.userData && UserService.userData.favorites
        && UserService.userData.favorites.includes(next.value) ? 1 : -1;
    };
  }

  angular
    .module('chatterBox')
    .directive('sidebar', function() {
      return {
        restrict: "E",
        scope: {},
        link: function() {},
        templateUrl: '/templates/sidebar.html',
        controller: ['$scope', 'RoomService', 'UserService', sidebarCtrl],
        replace: true
      };
    })
})();
