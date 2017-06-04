(function() {
  angular.module('chatterBox')
    .directive('favorites', function() {
      return {
        restrict: 'AE',
        scope: {
          favorites: '='
        },
        replace: true,
        templateUrl: '/templates/favorites.html'
      };
    });
})();
