(function() {
  function chatRoomCtrl($scope, $stateParams, MessageService, RoomService, UserService, UserDataService) {
    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.room = RoomService.get($stateParams.id, $stateParams.pub);
    $scope.messages = MessageService.get($stateParams.id);
  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope','$stateParams', 'MessageService', 'RoomService', 'UserService', 'UserDataService', chatRoomCtrl]);
})();
