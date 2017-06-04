(function() {
  function RoomService ($firebaseArray, $firebaseObject) {
    let Rooms = {};
    const ref = firebase.database().ref('rooms'),
          rooms = $firebaseArray(ref);
    Rooms.all = rooms;
    Rooms.add = function (item) {
      rooms.$add(item).then((ref) => {
        console.log("added record with id " + ref.key);
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
