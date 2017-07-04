(function() {
  function chatRoomCtrl($scope, $state, $stateParams, MessageService, RoomService, UserService, UserDataService) {
    if (!UserService.currentUser) {
      $state.go('home');
      return;
    }
    const id = $stateParams.id;

    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.room = RoomService.get(id);

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

  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope', '$state', '$stateParams', 'MessageService', 'RoomService', 'UserService', 'UserDataService', chatRoomCtrl]);
})();
