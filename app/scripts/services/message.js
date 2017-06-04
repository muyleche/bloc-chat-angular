(function() {
  function MessageService ($firebaseArray, RoomService) {
    let Messages = {};
    const ref = firebase.database().ref('messages'),
          messages = $firebaseArray(ref);
    Messages.all = messages;
    Messages.add = function (message, room) {
      message.dateSubmitted = (new Date()).valueOf();
      Messages[room.$id].$add(message).then((ref) => {
        console.log("added record with id " + ref.key);
        RoomService.updateLastMessage(room, message);
      });
    };
    Messages.remove = function (message) {
      messages.$remove(message).then((ref) => {
        console.log("removed record with id " + ref.key);
      });
    };
    Messages.getMessages = function (roomId) {
      this[roomId] = $firebaseArray(firebase.database().ref('messages/'+roomId));
      return this[roomId];
    };
    return Messages;
  }

  angular
    .module('chatterBox')
    .factory('MessageService', ['$firebaseArray','RoomService', MessageService]);
})();
