(function() {
  function UserService($state, $cookies, $firebaseAuth, $firebaseObject, UserDataService, RoomService, MessageService) {
    const User = { loading: false, remembered: ($cookies.get('email') || '') },
          authObject = $firebaseAuth(),
          settingsRef = firebase.database().ref('settings'),
          invitationsRef = firebase.database().ref('invitations');

    /**
     * Creates a new Firebase user with the provided information.
     * @param  {Object} [options={email, password, rememberMe}] Object with email, password, rememberMe attributes.
     * @return {Promise}        Promise object for the user auth request.
     */
    User.signUp = function (options = {email, password, rememberMe}) {
      const authPromise = authObject.$createUserWithEmailAndPassword(options.email, options.password);
      return finishLogin(authPromise, options.rememberMe);
    };

    /**
     * Function to log in a user.
     * @param  {Object} [options={email, password, rememberMe}] Object with email, password, rememberMe attributes.
     * @return {Promise}        Promise object for the user auth request.
     */
    User.logIn = function (options = {email, password, rememberMe}) {
      const authPromise = authObject.$signInWithEmailAndPassword(options.email, options.password);
      return finishLogin(authPromise, options.rememberMe);
    };

    /**
     * Function to standardize the handling of a login request.
     * @param  {Promise} authPromise
     */
    function finishLogin(authPromise, rememberMe) {
      User.loading = true;
      return authPromise.then((user) => {
        User.currentUser = user;
        UserDataService.init(user);
        UserDataService.waitForAllUsers().then(() => {User.userData = UserDataService.get(user.uid);});
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
      });
    }

    /**
     * Function to update user information.
     * @param  {HTMLEvent} event         The HTML event that triggered the udpate (to access element).
     * @param  {Object} [options={email,displayName,photoURL}]    The data to be udpated on this user.
     */
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
            let userDataChanged = false;
            if (photoURL) {
              this.currentUser.photoURL = photoURL;
              UserDataService.set(userId, 'photoURL', photoURL);
              userDataChanged = true;
            }
            if (displayName) {
              this.currentUser.displayName = displayName;
              UserDataService.set(userId, 'displayName', displayName);
              userDataChanged = true;
            }
            if (userDataChanged) UserDataService.save(userId);
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          });
      }
    };

    /**
     * Function to update the password for the currently logged in user.
     * @param  {HTMLEvent} event                 The HTMl event that triggered this update (to access element).
     * @param  {object} [options={currentPwd,newPwd,confirmPwd}] The data to be updated.
     */
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

    /**
     * Log out the currently authenticated user.
     */
    User.logOut = function () {
      if (authObject.$getAuth()) {
        const userId = this.currentUser.uid;
        $state.go('home');
        authObject.$signOut()
          .then(() => {
            $cookies.remove('email');
            this.userSettings.$destroy();
            this.userInvitations.$destroy();
            this.currentUser = null;
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

    /**
     * Toggle the provided room as a favorite of the currently logged in user.
     * @param  {string} roomId The ID for the room to favorite/unfavorite.
     */
    User.toggleFavorite = function (roomId) {
      if (this.userSettings) {
        if (!this.userSettings.favorites) this.userSettings.favorites = [];
        if (this.userSettings.favorites.includes(roomId)) this.userSettings.favorites.splice(this.userSettings.favorites.indexOf(roomId),1);
        else this.userSettings.favorites = this.userSettings.favorites.concat([roomId]);
        this.userSettings.$save()
          .then(() => console.log("The user's favorites saved."))
          .catch((error) => console.log("Failed to save the user's favorites.", error));
      }
    };

    return User;
  }

  angular.module('chatterBox')
    .factory('UserService',['$state', '$cookies', '$firebaseAuth', '$firebaseObject', 'UserDataService', 'RoomService', 'MessageService', UserService]);
})();
