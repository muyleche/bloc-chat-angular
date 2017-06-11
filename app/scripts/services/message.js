(function() {
  function MessageService ($firebaseArray, RoomService) {
    let Messages = {};
    const ref = firebase.database().ref().child('messages'),
          messages = $firebaseArray(ref);
    Messages.all = messages;
    Messages.add = function (event, message, room, user) {
      message.author = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };
      message.dateSubmitted = (new Date()).valueOf();
      Messages[room.$id].$add(message).then((ref) => {
        console.log("added record with id " + ref.key);
        RoomService.updateLastMessage(room, message);
        event.target.closest('form').reset();
      });
    };
    Messages.remove = function (message) {
      messages.$remove(message).then((ref) => {
        console.log("removed record with id " + ref.key);
      });
    };
    Messages.getMessages = function (roomId) {
      if (!this[roomId])
        this[roomId] = $firebaseArray(firebase.database().ref('messages/'+roomId));
      return this[roomId];
    };
    return Messages;
  }

  angular
    .module('chatterBox')
    .factory('MessageService', ['$firebaseArray','RoomService', MessageService]);
})();
