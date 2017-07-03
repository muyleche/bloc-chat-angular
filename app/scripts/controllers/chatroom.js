(function() {
  function chatRoomCtrl($scope, $state, $stateParams, MessageService, RoomService, UserService, UserDataService) {
    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    if (!UserService.currentUser) {
      $state.go('home');
      return;
    }
    $scope.UserDataService = UserDataService;
    $scope.room = RoomService.get($stateParams.id);
    if ($scope.room.public) {
      let updates = { };
      updates['/members/'+$stateParams.id+'/'+UserService.currentUser.uid] = "";
      firebase.database().ref().update(updates)
        .then((data) => {
          $scope.messages = MessageService.get($stateParams.id);
        });
    }
    else {
      $scope.messages = MessageService.get($stateParams.id);
    }

    $scope.$watch(() => UserService.currentUser,
      (nextVal) => {
        if (nextVal) {
          $scope.room = RoomService.get($stateParams.id);
          $scope.messages = MessageService.get($stateParams.id);
        }
      });
  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope', '$state', '$stateParams', 'MessageService', 'RoomService', 'UserService', 'UserDataService', chatRoomCtrl]);
})();
