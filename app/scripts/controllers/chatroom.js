(function() {
  function chatRoomCtrl($scope, $state, $stateParams, MessageService, RoomService, UserService, UserDataService) {
    if (!UserService.currentUser) {
      $state.go('home');
      return;
    }
    $scope.id = $stateParams.id;
    $scope.MessageService = MessageService;
    $scope.UserService = UserService;
    $scope.UserDataService = UserDataService;
    $scope.room = RoomService.get($scope.id);


    if ($scope.room.public) {
      let updates = { };
      updates['/members/'+$scope.id+'/'+UserService.currentUser.uid] = "";
      firebase.database().ref().update(updates);
    }

  }

  angular.module('chatterBox')
    .controller('chatRoomCtrl',['$scope', '$state', '$stateParams', 'MessageService', 'RoomService', 'UserService', 'UserDataService', chatRoomCtrl]);
})();
