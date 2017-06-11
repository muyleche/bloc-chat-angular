(function () {

  function appInit($cookies, UserService) {
    const email = $cookies.get('email'),
          password = $cookies.get('password');
    if (email && password) {
      UserService.logInWithCreds(firebase.auth.EmailAuthProvider.credential(email, password));
    }
  }

  angular
    .module('chatterBox')
    .run(['$cookies', 'UserService', appInit]);
})();
