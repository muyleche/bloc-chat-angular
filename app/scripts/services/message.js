(function() {
  function MessageService ($firebaseArray, RoomService, UserDataService) {
    let Messages = {};
    const ref = firebase.database().ref('messages');

    Messages.add = (event, message, room, user) => {
      message.author = user.uid;
      message.dateSubmitted = (new Date()).valueOf();
      this[room.$id].$add(message).then((ref) => {
        console.log("added record with id " + ref.key);
        RoomService.updateLastMessage(room, message);
        event.target.closest('form').reset();
      }).catch((error) => {
        console.log("Failed to submit post.", error);
      });
    };
    Messages.remove = (message) => {
      messages.$remove(message).then((ref) => {
        console.log("removed record with id " + ref.key);
      }).catch((error) => {
        console.log("Failed to remove post.", error);
      });
    };
    Messages.get = (roomId) => {
      if (!this[roomId]) {
        this[roomId] = $firebaseArray(ref.child(roomId));
        this[roomId].$loaded()
          .then(() => {
            console.log('retrieved messages for room ', roomId);
            // get the author information for each post.
            this[roomId].map((val) => {
              if (typeof val.author === 'string') UserDataService.get(val.author)
            });
            this[roomId].allowed = true;
          }).catch((error) => {
            console.log("Failed to retrieve messages.", error);
          });
          console.log(this[roomId]);
      }
      return this[roomId];
    };
    return Messages;
  }

  angular
    .module('chatterBox')
    .factory('MessageService', ['$firebaseArray','RoomService', 'UserDataService', MessageService]);
})();
