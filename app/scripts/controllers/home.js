(function() {
  function homeCtrl($scope, RoomService) {
  }
  angular
    .module('chatterBox')
    .controller('homeCtrl', ['$scope', 'RoomService', homeCtrl]);
})();
