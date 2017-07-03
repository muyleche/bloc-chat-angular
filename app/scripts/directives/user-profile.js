(function() {
  function userProfileCtrl ($scope, $state, $stateParams, UserService) {
    $scope.UserService = UserService;
    if (!UserService.currentUser) {
      $state.go('home');
      return;
    }
  };

  angular.module('chatterBox')
    .controller('userProfileCtrl', ['$scope', '$state', '$stateParams','UserService', userProfileCtrl]);

})();
