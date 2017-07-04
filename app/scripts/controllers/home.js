(function() {
  function homeCtrl($scope, RoomService, UserService, UserDataService) {
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.RoomService = RoomService;
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', 'UserService', 'UserDataService', homeCtrl]);
})();
