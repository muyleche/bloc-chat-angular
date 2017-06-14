(function() {
  function chatRoomCtrl($scope, $stateParams, MessageService, RoomService, UserService, UserDataService) {
    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.room = RoomService.getRoom($stateParams.id);
    $scope.messages = MessageService.getMessages($stateParams.id);
  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope','$stateParams', 'MessageService', 'RoomService', 'UserService', 'UserDataService', chatRoomCtrl]);
})();
