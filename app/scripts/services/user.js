(function() {
  function userService($firebaseObject) {
    let Users = {};
    const ref = firebase;

    Users.get = (id) => {
      firebase.$get().then(() => {

      });
    };
    return Users;
  }

  angular.module('chatterBox')
    .factory('userService',['$firebaseObject', userService]);
})();
