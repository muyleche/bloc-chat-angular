(function() {
  function config($stateProvider, $locationProvider, $urlRouterProvider) {
    // hide 'hash' notation in URL.
    // don't require the 'base' url tag in the HTML head.
    $locationProvider
      .html5Mode({
        enabled: true,
        requireBase: false
      });

      // if any unanticipated URL path is provided, go to the landing page.
    $urlRouterProvider.when('/home', '/').otherwise('/');

    // define routes using ui-router.
    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: '/templates/home.html',
        controller: 'homeCtrl'
      });
  }

  const firebaseConfig = {
    apiKey: "AIzaSyDnOnlekUTkASlprdLnvtwSzNvqvYFnLII",
    authDomain: "chatterbox-511b6.firebaseapp.com",
    databaseURL: "https://chatterbox-511b6.firebaseio.com",
    projectId: "chatterbox-511b6",
    storageBucket: "chatterbox-511b6.appspot.com",
    messagingSenderId: "989125503086"
  };
  firebase.initializeApp(firebaseConfig);

  // define primary angular module and config.
  angular
    .module('chatterBox', ['ui.router','firebase'])
    .config(config);
})();
