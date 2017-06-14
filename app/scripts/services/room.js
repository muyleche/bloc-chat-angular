(function() {
  function RoomService ($firebaseArray, $firebaseObject, UserDataService) {
    let Rooms = {};
    const ref = firebase.database().ref().child('rooms'),
          rooms = $firebaseArray(ref);
    Rooms.all = rooms;
    Rooms.add = function (event, item, uid) {
      if (!item.public) {
        item.members = item.members.split(/[,\n]/g)
          .reduce((users, val) => {
            const id = UserDataService.getUserIdFromEmail(val);
            if (id) users.push(id);
            return users;
          }, []);
        if (!item.members.includes(uid)) item.members.push(uid);
      }
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
    .factory('RoomService', ['$firebaseArray', '$firebaseObject', 'UserDataService', RoomService]);
})();
