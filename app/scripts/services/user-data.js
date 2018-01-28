(function() {
  function UserDataService($firebaseObject, $firebaseArray) {
    const UserData = { },
          ref = firebase.database().ref('users');
    let allUsers;// = $firebaseArray(ref);

    /**
     * Initializes the user data to properly display author images/names, etc.
     * @param  {User} user The user object whose data you want to retrieve.
     * @return {UserData}      The data for the user.
     */
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

    /**
     * Function to determine if all the user data is available yet.
     * @return {boolean}
     */
    UserData.waitForAllUsers = function () {
      if (!allUsers) allUsers = $firebaseArray(ref);
      return allUsers.$loaded();
    };

    /**
     * Gets the user ID for a provided email (used to assiciate users with rooms).
     * @param  {string} email The email of the user you are trying to identify.
     * @return {string}       The desired user's id.
     */
    UserData.getUserIdFromEmail = function (email) {
      if (allUsers) {
        for (let val of allUsers) {
          if (val.email === email) return val.$id;
        }
      }
    }

    /**
     * Function to set the user data.
     * @param  {string} userId The ID of the user to update.
     * @param  {string} field  The attribute to be udpated.
     * @param  {string} value  The new value for the attribute.
     */
    UserData.set = function (userId, field, value) {
      if (allUsers) {
        const data = allUsers.$getRecord(userId);
        if (data) data[field] = value;
      }
    };

    /**
     * Function to get the data for a particular userId.
     * @param  {string} userId The ID of the user.
     * @return {UserData}        The data for the user.
     */
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

    /**
     * Function to save the user data for a particular user.
     * @param  {string} userId The ID for the user.
     */
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

    /**
     * Clears the UserData object to protect private information.
     */
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
