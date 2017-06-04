(function() {
  function chatRoomCtrl($scope, $stateParams, MessageService, RoomService) {
    $scope.MessageService = MessageService;
    $scope.room = RoomService.getRoom($stateParams.id);
    $scope.messages = MessageService[$stateParams.id] || MessageService.getMessages($stateParams.id);
  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope','$stateParams', 'MessageService', 'RoomService', chatRoomCtrl]);
})();
