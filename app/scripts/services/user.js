(function() {
  function UserService($cookies, $firebaseAuth, $firebaseObject) {
    const User = { loading: false },
          authObject = $firebaseAuth();
    User.logIn = (event, options = {email, password, keepMeLoggedIn}) => {
      User.loading = true;
      const {email, password, keepMeLoggedIn} = options,
        creds = firebase.auth.EmailAuthProvider.credential(email,password);
      authObject.$signInWithCredential(creds)
        .then((user) => {
          User.currentUser = user;
          getUserData(user.uid);
          const thisDate = new Date();
          thisDate.setDate(thisDate.getDate()+1);
          if (keepMeLoggedIn) {
            $cookies.put('email', email);
            $cookies.put('password', password, { expires: thisDate });
          }
          User.loading = false;
          console.log('logged in as '+user.uid);
          event.target.closest('form').reset();
        })
        .catch((error) => {
          alert('Authentication failed. Verify username and password and try again.');
        });
    };
    User.logInWithCreds = (creds) => {
      User.loading = true;
      authObject.$signInWithCredential(creds)
        .then((user) => {
          User.currentUser = user;
          getUserData(user.uid);
          User.loading = false;
          console.log('logged in as '+user.uid);
        })
        .catch((error) => {
          alert('Authentication failed. Verify username and password and try again.');
        });
    };
    User.signUp = (event, options = {email, password, keepMeLoggedIn}) => {
      User.loading = true;
      const {email, password, keepMeLoggedIn} = options;
      authObject.$createUserWithEmailAndPassword(email, password)
        .then((user) => {
          User.currentUser = user;
          getUserData(user.uid);
          const thisDate = new Date();
          thisDate.setDate(thisDate.getDate()+1);
          if (keepMeLoggedIn) {
            $cookies.put('email', email);
            $cookies.put('password', password, { expires: thisDate });
          }
          User.loading = false;
          console.log('logged in as '+user.uid);
          event.target.closest('form').reset();
        })
        .catch((error) => {
          alert('create user failed.', error);
        });
    };
    User.updateProfile = (event, options = {email, displayName, photoURL}) => {
      if (!User.currentUser) return;
      const {email, displayName, photoURL} = options;
      if (email && email !== User.currentUser.email) {
        //change email here;
        authObject.$updateEmail(email)
          .then(() => {
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          });
      }
      if (displayName !== User.currentUser.displayName || photoURL !== User.currentUser.photoURL) {
        //update user profile info.
        User.currentUser.updateProfile({displayName, photoURL})
          .then(() => {
            User.currentUser.displayName = displayName;
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          });
      }
    };
    User.updatePassword = (event, options = {currentPwd, newPwd, confirmPwd}) => {
      if (!User.currentUser) return;
      const {currentPwd, newPwd, confirmPwd} = options;
      if (newPWd && newPwd !== confirmPwd) {
        alert("Your new password and confirmation don't match.");
      }
      else {
        User.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(User.currentUser.email,currentPwd))
          .then(() => {
            User.currentUser.updatePassword(newPwd)
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
    User.logOut = () => {
      if (authObject.$getAuth()) {
        authObject.$signOut()
        .then(() => {
          User.currentUser = null;
          User.userData.$destroy();
          $cookies.remove('email');
          $cookies.remove('password');
        })
        .catch((error) => console.log(error));
      }
    };
    User.toggleFavorite = (id) => {
      User.userData.favorites = User.userData.favorites || [];
      if (User.userData.favorites.includes(id)) User.userData.favorites.splice(User.userData.favorites.indexOf(id),1);
      else User.userData.favorites = [id].concat(User.userData.favorites);
      saveUserData();
    };
    function saveUserData() {
      if (!User.userData) getUserData();
      User.userData.$save();
    };
    function getUserData(userId) {
      if (User.currentUser) {
        User.userData = $firebaseObject(firebase.database().ref('users/'+userId));
        if (!User.userData.hasOwnProperty('favorites')) {
          User.userData.favorites = [];
        }
        return User.userData;
      }
    };

    return User;
  }

  angular.module('chatterBox')
    .factory('UserService',['$cookies', '$firebaseAuth', '$firebaseObject', UserService]);
})();
