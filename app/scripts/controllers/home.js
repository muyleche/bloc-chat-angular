(function() {
  function homeCtrl($scope, RoomService, UserService, UserDataService) {
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.rooms = RoomService.allPublic;
    $scope.$watch(() => RoomService.allPublic,
      (nextVal) => $scope.rooms = RoomService.allPublic);
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', 'UserService', 'UserDataService', homeCtrl]);
})();
