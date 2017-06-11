(function() {
  function chatRoomCtrl($scope, $stateParams, MessageService, RoomService, UserService) {
    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    $scope.room = RoomService.getRoom($stateParams.id);
    $scope.messages = MessageService[$stateParams.id] || MessageService.getMessages($stateParams.id);
  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope','$stateParams', 'MessageService', 'RoomService', 'UserService', chatRoomCtrl]);
})();
