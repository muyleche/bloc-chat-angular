(function() {
  function navbarCtrl() {

  }

  angular
    .module('chatterBox')
    .directive('navigation', function() {
      return {
        restrict: 'AEC',
        scope: {},
        link: function() {},
        replace: true,
        templateUrl: '/templates/navbar.html',
        controller: navbarCtrl
      };
    });
})();
