(function() {
  function UserService($cookies, $firebaseAuth, UserDataService) {
    const User = { loading: false },
          authObject = $firebaseAuth();
    User.logIn = (event, options = {email, password, keepMeLoggedIn}) => {
      User.loading = true;
      const {email, password, keepMeLoggedIn} = options,
        creds = firebase.auth.EmailAuthProvider.credential(email,password);
      authObject.$signInWithCredential(creds)
        .then((user) => {
          User.currentUser = user;
          User.userData = UserDataService.get(user);
          const thisDate = new Date();
          thisDate.setDate(thisDate.getDate()+1);
          if (keepMeLoggedIn) {
            $cookies.put('email', email);
            $cookies.put('password', password, { expires: thisDate });
          }
          console.log('logged in as '+user.uid);
          event.target.closest('form').reset();
        })
        .catch((error) => {
          alert('Authentication failed. Verify username and password and try again.', error);
        })
        .finally(() => {
          User.loading = false;
        });
    };
    User.logInWithCreds = (creds) => {
      User.loading = true;
      authObject.$signInWithCredential(creds)
        .then((user) => {
          User.currentUser = user;
          User.userData = UserDataService.get(user);
          console.log('logged in as '+user.uid);
        })
        .catch((error) => {
          alert('Authentication failed. Verify username and password and try again.');
        })
        .finally(() => {
          User.loading = false;
        });
    };
    User.signUp = (event, options = {email, password, keepMeLoggedIn}) => {
      User.loading = true;
      const {email, password, keepMeLoggedIn} = options;
      authObject.$createUserWithEmailAndPassword(email, password)
        .then((user) => {
          User.currentUser = user;
          User.userData = UserDataService.get(user);
          UserDataService.set();
          const thisDate = new Date();
          thisDate.setDate(thisDate.getDate()+1);
          if (keepMeLoggedIn) {
            $cookies.put('email', email);
            $cookies.put('password', password, { expires: thisDate });
          }
          console.log('logged in as '+user.uid);
          event.target.closest('form').reset();
        })
        .catch((error) => {
          alert('create user failed.', error);
        })
        .finally(() => {
          User.loading = false;
        });
    };
    User.updateProfile = (event, options = {email, displayName, photoURL}) => {
      if (!User.currentUser) return;
      const {email, displayName, photoURL} = options,
            userId = User.currentUser.uid;

      if (email && email !== User.currentUser.email) {
        // change email here
        authObject.$updateEmail(email)
          .then(() => {
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
          })
          .catch((error) => {
            console.log("Failed to update profile information",error);
          });
      }
      if (displayName || photoURL) {
        // update user profile info.
        User.currentUser.updateProfile({displayName, photoURL})
          .then(() => {
            console.log("Profile information successfully updated.");
            event.target.closest('form').reset();
            const userDataChanged = false;
            if (photoURL !== User.userData.photoURL) {
              User.currentUser.photoURL = photoURL;
              UserDataService.set(userId, 'photoURL', photoURL);
              userDataChanged = true;
            }
            if (displayName !== User.userData.displayName) {
              User.currentUser.displayName = displayName;
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
        const userId = User.currentUser.uid;
        authObject.$signOut()
        .then(() => {
          UserDataService[userId].$destroy();
          UserDataService[userId] = null;
          $cookies.remove('email');
          $cookies.remove('password');
          User.currentUser = null;
        })
        .catch((error) => console.log(error));
      }
    };

    User.toggleFavorite = (roomId) => {
      const userId = User.currentUser.uid;
      if (userId) {
        if (UserDataService[userId].favorites.includes(roomId)) UserDataService[userId].favorites.splice(UserDataService[userId].favorites.indexOf(roomId),1);
        else UserDataService[userId].favorites = UserDataService[userId].favorites.concat([roomId]);
        UserDataService.save(userId);
      }
    };

    return User;
  }

  angular.module('chatterBox')
    .factory('UserService',['$cookies', '$firebaseAuth', 'UserDataService', UserService]);
})();
