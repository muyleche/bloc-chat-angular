(function() {
  function UserDataService($firebaseObject, $firebaseArray) {
    const UserData = { },
          ref = firebase.database().ref('users');
    let allUsers;// = $firebaseArray(ref);

    UserData.init = function (user) {
      if (user) {
        let settings = $firebaseObject(ref.child(user.uid));
        settings.$loaded()
          .then((data) => {
            data.$save();
            data.displayName = user.displayName;
            data.photoURL = user.photoURL;
            data.email = user.email;
            data.$save();
            UserData.waitForAllUsers();
            console.log("The user's info was saved");
          })
          .catch((error) => {
            console.log("Failded to initialize userData.", error);
          });
        return settings;
      }
    };

    UserData.waitForAllUsers = function () {
      if (!allUsers) allUsers = $firebaseArray(ref);
      return allUsers.$loaded();
    };

    UserData.getUserIdFromEmail = function (email) {
      if (allUsers) {
        for (let val of allUsers) {
          if (val.email === email) return val.$id;
        }
      }
    }

    UserData.set = function (userId, field, value) {
      if (allUsers) {
        const data = allUsers.$getRecord(userId);
        if (data) data[field] = value;
      }
    };

    UserData.get = function (userId) {
      if (!this[userId]) {
        if (allUsers && allUsers.$resolved) {
          this[userId] = allUsers.$getRecord(userId) || $firebaseObject(firebase.database().ref('/users/'+userId));
        }
        else {
          console.log(Error("There was an issue retrieving info for "+userId));
        }
      }
      if (this[userId]) return this[userId];
    };

    UserData.save = function (userId) {
      if (allUsers) {
        const index = allUsers.$indexFor(userId);
        if (index >= 0) {
          allUsers.$save(index)
            .then(() => {
              console.log("The user's info was saved.");
            })
            .catch((error) => console.log(`Failed to save ${userId}'s data.`));
        }
      }
    };

    UserData.reset = function () {
      if (allUsers) {
        allUsers.$destroy();
        allUsers = null;
      }
    };

    UserData.init();
    return UserData;
  }

  angular.module('chatterBox')
    .factory('UserDataService',['$firebaseObject', '$firebaseArray', UserDataService]);
})();
