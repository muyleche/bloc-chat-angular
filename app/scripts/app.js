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
    $urlRouterProvider.otherwise('/');

    // define routes using ui-router.
    $stateProvider
      .state('home',{
        url: '/',
        templateUrl: '/templates/home.html',
        controller: 'homeCtrl'
      })
      .state('room', {
        url:'/room/{id:string}',
        templateUrl: '/templates/chat-room.html',
        controller: 'chatRoomCtrl'
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
    .module('chatterBox', ['ui.router','firebase', 'ui.bootstrap'])
    .config(config);
})();
