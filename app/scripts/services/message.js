(function() {
  function MessageService ($firebaseArray, RoomService, UserDataService) {
    let Messages = {};
    const ref = firebase.database().ref().child('messages'),
          messages = $firebaseArray(ref);
    Messages.all = messages;
    Messages.add = (event, message, room, user) => {
      message.author = user.uid;
      message.dateSubmitted = (new Date()).valueOf();
      Messages[room.$id].$add(message).then((ref) => {
        console.log("added record with id " + ref.key);
        RoomService.updateLastMessage(room, message);
        event.target.closest('form').reset();
      });
    };
    Messages.remove = (message) => {
      messages.$remove(message).then((ref) => {
        console.log("removed record with id " + ref.key);
      });
    };
    Messages.getMessages = (roomId) => {
      if (!this[roomId]) {
        this[roomId] = $firebaseArray(firebase.database().ref('messages/'+roomId));
        this[roomId].$loaded()
          .then(() => {
            // get the author information for each post.
            this[roomId].map((val) => {
              if (typeof val.author === 'string') UserDataService.get(val.author)
            });
          });
      }
      return this[roomId];
    };
    return Messages;
  }

  angular
    .module('chatterBox')
    .factory('MessageService', ['$firebaseArray','RoomService', 'UserDataService', MessageService]);
})();
