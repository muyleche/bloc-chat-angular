(function(){
  function sidebarCtrl($scope, RoomService, $uibModal) {
    $scope.RoomService = RoomService;
    $scope.rooms = RoomService.all;
  }

  angular
    .module('chatterBox')
    .directive('sidebar', function() {
      return {
        restrict: "E",
        scope: {},
        link: function() {},
        templateUrl: '/templates/sidebar.html',
        controller: ['$scope', 'RoomService', '$uibModal', sidebarCtrl],
        replace: true
      };
    })
})();
