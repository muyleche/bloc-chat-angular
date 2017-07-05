(function() {
  function RoomFormCtrl ($scope, $element, RoomService, UserService) {
    $scope.modelObject;

    let inputs = $element.find('input'),
        focusElement, i;

    for (i = 0; i < inputs.length; i++) {
      if (inputs[i].hasAttribute('form-focus')) focusElement = inputs[i];
    }

    $scope.showForm = function () {
      $scope.modelObject = {};
      if (focusElement) setTimeout(() => focusElement.focus(), 25);
    };

    $scope.addRoom = function() {
      let result = RoomService.add($scope.modelObject, UserService.userSettings);
      if (typeof result.then === 'function') {
        result.then(() => {
          $scope.reset();
        });
      }
    };

    $scope.reset = function () {
      $scope.modelObject = null;
    };
  }

  angular.module('chatterBox')
    .controller('RoomFormCtrl', ['$scope', '$element', 'RoomService', 'UserService', RoomFormCtrl]);

  /**
   * @function Controller for the login/signup form element.
   * @param       {[type]} $scope      [description]
   * @param       {[type]} RoomService [description]
   * @param       {[type]} UserService [description]
   * @constructor
   */
  function LoginFormCtrl ($scope, UserService) {
    $scope.modelObject = {};

    $scope.logIn = function() {
      let result = UserService.logIn($scope.modelObject);
      if (typeof result.then === 'function') {
        result.then(() => {
          $scope.reset();
        });
      }
      else $scope.reset();
    };

    $scope.signUp = function() {
      let result = UserService.signUp($scope.modelObject);
      if (typeof result.then === 'function') {
        result.then(() => {
          $scope.reset();
        });
      }
      else $scope.reset();
    };

    $scope.reset = function () {
      $scope.modelObject = {};
    };
  }

  angular.module('chatterBox')
    .controller('LoginFormCtrl', ['$scope', 'UserService', LoginFormCtrl]);

  angular.module('chatterBox')
    .directive('ngEnter', function () {
      return {
        restrict: 'A',
        scope: { ngEnter: '&' },
        link: function (scope, element, attrs) {
          element.bind("keyup", function (event) {
            if (scope.ngEnter && event.which === 13 && !event.shiftKey && !event.altKey) {
              scope.$apply(() => scope.ngEnter());
              event.preventDefault();
            }
          });
        }
      }
    });

    function MessageFormCtrl ($scope, MessageService, UserService) {
      $scope.modelObject = {};

      $scope.addMessage = function(room) {
        let result = MessageService.add($scope.modelObject, room, UserService.currentUser);
        if (typeof result.then === 'function') {
          result.then(() => {
            $scope.reset();
          });
        }
      };

      $scope.reset = function () {
        $scope.modelObject = {};
      };
    }

    angular.module('chatterBox')
      .controller('MessageFormCtrl', ['$scope', 'MessageService', 'UserService', MessageFormCtrl]);

})();
