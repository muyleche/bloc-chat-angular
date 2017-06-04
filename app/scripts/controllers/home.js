(function() {
  function homeCtrl($scope, RoomService) {
    $scope.rooms = RoomService.all;
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', homeCtrl]);
})();
