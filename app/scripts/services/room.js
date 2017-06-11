(function() {
  function RoomService ($firebaseArray, $firebaseObject) {
    let Rooms = {};
    const ref = firebase.database().ref().child('rooms'),
          rooms = $firebaseArray(ref);
    Rooms.all = rooms;
    Rooms.add = function (event, item) {
      rooms.$add(item).then((ref) => {
        console.log("added record with id " + ref.key);
        event.target.closest('form').reset();
      });
    };
    Rooms.updateLastMessage = function (room, message) {
      room.lastMessage = message;
      room.$save().then((ref) => {
        console.log("saved record with id " + ref.key);
      });
    };
    Rooms.remove = function (item) {
      rooms.$remove(item).then((ref) => {
        console.log("removed record with id " + ref.key);
      });
    };
    Rooms.getRoom = function (id) {
      if (!this[id])
        this[id] = $firebaseObject(firebase.database().ref('rooms/'+id));
      return this[id];
    }
    return Rooms;
  }

  angular
    .module('chatterBox')
    .factory('RoomService', RoomService);
})();
