(function() {
  function homeCtrl($scope, $firebaseArray) {
    let ref = firebase.database().ref().child('messages');
    $scope.messages = $firebaseArray(ref);
  }
  angular.module('blocChat')
    .controller('homeCtrl', homeCtrl);
})();
