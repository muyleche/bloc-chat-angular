(function() {
  function homeCtrl($scope, RoomService) {
    $scope.rooms = RoomService.public;
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', homeCtrl]);
})();
