(function() {
  function userProfileCtrl ($scope, $stateParams, UserService) {
    $scope.UserService = UserService;
  };

  angular.module('chatterBox')
    .controller('userProfileCtrl', ['$scope', '$stateParams','UserService', userProfileCtrl]);

})();
