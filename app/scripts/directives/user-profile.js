(function() {
  function userProfileCtrl ($scope, $state, UserService) {
    $scope.UserService = UserService;
    if (!UserService.currentUser) $state.go('home');
  };

  angular.module('chatterBox')
    .controller('userProfileCtrl', ['$scope', '$state', 'UserService', userProfileCtrl]);

})();
