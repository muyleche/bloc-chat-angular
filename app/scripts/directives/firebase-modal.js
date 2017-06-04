(function() {
  function firebaseModalCtrl($uibModal) {
    
  }

  angular.('chatterBox', function() {
    return {
      restrict: 'E',
      scope: {
        ctrl: '='
      },
      templateUrl: '/templates/firebase-modal.html',
      controller: ['$uibModal', firebaseModalCtrl]
    };
  })
})();
