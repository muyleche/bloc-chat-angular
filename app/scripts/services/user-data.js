(function() {
  function UserService($firebaseObject, $firebaseArray) {
    const UserData = { },
          ref = firebase.database().ref().child('users'),
          allUsers = $firebaseArray(ref);

    UserData.getUserIdFromEmail = (email) => {
      for (let val of allUsers) {
        if (val.email === email) return val.$id;
      }
      return "";
    }

    UserData.set = (userId, field, value) => {
      if (UserData[userId]) {
        UserData[userId][field] = value;
      }
    };

    UserData.get = (user, field) => {
      const userId = user.uid;
      if (!UserData[userId]) {
        const ref = firebase.database().ref('users/'+userId);

        UserData[userId] = $firebaseObject(ref);
        // ensure primary userData fields exist.
        UserData[userId].favorites = UserData[userId].favorites || [];
        UserData[userId].displayName = UserData[userId].displayName || user.displayName || "";
        UserData[userId].photoURL = UserData[userId].photoURL || user.photoURL || "/assets/images/profile-default.png";
        UserData[userId].email = UserData[userId].email || user.email || "";
        UserData.save(userId);
      }
      if (field == null) return UserData[userId];
      else return UserData[userId][field];
    };

    UserData.save = (userId) => {
      if (UserData[userId]) UserData[userId].$save()
        .then(() => {
          console.log(`${userId}'s data saved.`);
        });
    };

    return UserData;
  }

  angular.module('chatterBox')
    .factory('UserDataService',['$firebaseObject', '$firebaseArray', UserService]);
})();
