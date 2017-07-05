(function() {
  function MessageService ($firebaseArray, RoomService, UserDataService) {
    let Messages = {};
    const ref = firebase.database().ref('messages');

    Messages.add = function (message, room, user) {
      message.author = user.uid;
      message.dateSubmitted = (new Date()).valueOf();
      return this[room.$id].$add(message)
        .then((ref) => {
          RoomService.updateLastMessage(room, message, this[room.$id]);
          console.log("Added record with id", ref.key);
        })
        .catch((error) => {
          console.log("Failed to submit post", error);
        });
    };

    Messages.remove = function (message) {
      messages.$remove(message).then((ref) => {
        console.log("removed record with id " + ref.key);
      }).catch((error) => {
        console.log("Failed to remove post.", error);
      });
    };

    Messages.get = function (roomId) {
      if (!this[roomId]) {
        this[roomId] = $firebaseArray(ref.child(roomId));
        this[roomId].$loaded()
          .then(() => {
            console.log('Retrieved messages for room', roomId);
            Messages[roomId].allowed = true;
          }).catch((error) => {
            console.log("Failed to retrieve messages", error);
          });
      }
      return this[roomId];
    };

    /**
     * @function Empty the message arrays.
     */
    Messages.reset = function () {
      for (let item in this) {
        if (typeof this[item] !== 'function' && this[item].$destroy) {
          this[item].$destroy();
          this[item] = null;
        }
      }
    }

    return Messages;
  }

  angular
    .module('chatterBox')
    .factory('MessageService', ['$firebaseArray','RoomService', 'UserDataService', MessageService]);
})();
