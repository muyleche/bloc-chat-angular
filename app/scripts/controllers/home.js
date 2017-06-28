(function() {
  function homeCtrl($scope, RoomService) {
    $scope.rooms = RoomService.allPublic;
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', homeCtrl]);
})();
