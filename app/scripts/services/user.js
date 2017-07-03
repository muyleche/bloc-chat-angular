(function() {
  function UserService($state, $cookies, $firebaseAuth, $firebaseObject, UserDataService, RoomService, MessageService) {
    const User = { loading: false },
          authObject = $firebaseAuth(),
          settingsRef = firebase.database().ref('settings'),
          invitationsRef = firebase.database().ref('invitations');

    User.remembered = $cookies.get('email') || '';

    User.signUp = function (event, options = {email, password, rememberMe}) {
      const authPromise = authObject.$createUserWithEmailAndPassword(options.email, options.password);
      finishLogin(authPromise, event, options.password, options.rememberMe);
    };

    User.logIn = function (event, options = {email, password, rememberMe}) {
      const authPromise = authObject.$signInWithEmailAndPassword(options.email, options.password);
      finishLogin(authPromise, event, options.password, options.rememberMe);
    };

    User.logInWithCreds = function (creds) {
      finishLogin(authObject.$signInWithCredential(creds));
    };

    function finishLogin(authPromise, event, password, rememberMe) {
      User.loading = true;
      return authPromise.then((user) => {
        User.currentUser = user;
        UserDataService.init(user);
        User.userData = UserDataService.get(user.uid);
        User.userSettings = $firebaseObject(settingsRef.child(user.uid));
        User.userInvitations = $firebaseObject(invitationsRef.child(user.uid));
        RoomService.init();
        RoomService.getPrivateRooms(User.userInvitations);
        RoomService.getUserRooms(User.userSettings);
        const thisDate = new Date();
        thisDate.setDate(thisDate.getDate()+1);
        if (rememberMe) {
          $cookies.put('email', user.email);
          console.log('Remembering', user.email);
        }
        console.log('Logged in as '+user.uid);
      })
      .catch((error) => {
        console.log(error);
        alert('Authentication failed. Verify username and password and try again.');
      })
      .finally(() => {
        User.loading = false;
        if (event) event.target.closest('form').reset();
      });
    }

    User.updateProfile = function (event, options = {email, displayName, photoURL}) {
      if (!this.currentUser) return;
      const {email, displayName, photoURL} = options,
            userId = this.currentUser.uid;

      if (email && email !== this.currentUser.email) {
        // change email here
        authObject.$updateEmail(email)
          .then(() => {
            console.log("Profile information successfully updated.");
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          })
          .finally(() => event.target.closest('form').reset());
      }
      if (displayName || photoURL) {
        // update user profile info.
        this.currentUser.updateProfile({displayName, photoURL})
          .then(() => {
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
            let userDataChanged = false;
            if (photoURL !== this.userData.photoURL) {
              this.currentUser.photoURL = photoURL;
              UserDataService.set(userId, 'photoURL', photoURL);
              userDataChanged = true;
            }
            if (displayName !== this.userData.displayName) {
              this.currentUser.displayName = displayName;
              UserDataService.set(userId, 'displayName', displayName);
              userDataChanged = true;
            }
            if (userDataChanged) UserDataService.save(userId);
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          });
      }
    };

    User.updatePassword = function (event, options = {currentPwd, newPwd, confirmPwd}) {
      if (!this.currentUser) return;
      const {currentPwd, newPwd, confirmPwd} = options;
      if (newPWd && newPwd !== confirmPwd) {
        alert("Your new password and confirmation don't match.");
      }
      else {
        this.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(this.currentUser.email,currentPwd))
          .then(() => {
            this.currentUser.updatePassword(newPwd)
              .then(() => {
                console.log("Password changed successfully.");
                event.target.closest('form').reset();
              })
              .catch((error) => {
                alert("Failed to update password.", error);
              });
          })
          .catch((error) => {
            alert("Failed to validate current password.", error);
          });
      }
    };

    User.logOut = function () {
      if (authObject.$getAuth()) {
        const userId = this.currentUser.uid;
        $state.go('home');
        authObject.$signOut()
          .then(() => {
            $cookies.remove('email');
            this.currentUser = null;
            this.userSettings.$destroy();
            this.userInvitations.$destroy();
            this.userSettings = null;
            this.userInvitations = null;
            RoomService.reset();
            MessageService.reset();
            UserDataService.reset();
            console.log('Successfully logged out.');
          })
          .catch((error) => console.log('Failed to log user out.',error));
      }
    };

    User.toggleFavorite = function (roomId) {
      if (!this.currentUser) return;
      const userId = this.currentUser.uid;
      if (userId) {
        console.log(this.userSettings);
        if (this.userSettings && this.userSettings.favorites.includes(roomId))
          this.userSettings.favorites.splice(this.userSettings.favorites.indexOf(roomId),1);
        else this.userSettings.favorites = this.userSettings.favorites.concat([roomId]);
        UserDataService.save(userId);
      }
    };

    return User;
  }

  angular.module('chatterBox')
    .factory('UserService',['$state', '$cookies', '$firebaseAuth', '$firebaseObject', 'UserDataService', 'RoomService', 'MessageService', UserService]);
})();
